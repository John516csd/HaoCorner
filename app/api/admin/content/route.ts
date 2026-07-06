import { readdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import type {
  AlbumStickerPreset,
  FavoriteSong,
  PhotoAlbum,
  TapeColor,
} from "../../../data/home";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type AlbumId = PhotoAlbum["id"];

type AdminContentPayload = {
  photoAlbums: PhotoAlbum[];
  favoriteSongs: FavoriteSong[];
};

type ScannedAssets = {
  photos: Record<AlbumId, string[]>;
  covers: string[];
};

const dataDir = path.join(process.cwd(), "app", "data", "content");
const photoAlbumsPath = path.join(dataDir, "photo-albums.json");
const favoriteSongsPath = path.join(dataDir, "favorite-songs.json");

const albumIds = ["jeju", "xinjiang", "street"] as const;
const stickerPresets: AlbumStickerPreset[] = ["jeju", "xinjiang", "street"];
const tapeColors: TapeColor[] = [
  "red",
  "blue",
  "yellow",
  "green",
  "pink",
  "white",
];

const photoFolderConfig: Record<AlbumId, string[]> = {
  jeju: ["jeju", "optimized"],
  xinjiang: ["xinjiang", "optimized"],
  street: ["street-vibe", "optimized"],
};

const imageExtensions = new Set([
  ".avif",
  ".gif",
  ".jpeg",
  ".jpg",
  ".png",
  ".webp",
]);

function isProduction() {
  return process.env.NODE_ENV === "production";
}

function localOnlyResponse() {
  return NextResponse.json(
    { error: "Content manager is only available in local development." },
    { status: 404 }
  );
}

async function readJsonFile<T>(filePath: string): Promise<T> {
  const file = await readFile(filePath, "utf8");
  return JSON.parse(file) as T;
}

async function scanPublicFolder(parts: string[]): Promise<string[]> {
  const folderPath = path.join(process.cwd(), "public", ...parts);
  const publicPrefix = `/${parts.join("/")}`;
  const entries = await readdir(folderPath, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isFile())
    .filter((entry) => imageExtensions.has(path.extname(entry.name).toLowerCase()))
    .map((entry) => `${publicPrefix}/${entry.name}`)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

async function loadContent(): Promise<AdminContentPayload> {
  const [photoAlbums, favoriteSongs] = await Promise.all([
    readJsonFile<PhotoAlbum[]>(photoAlbumsPath),
    readJsonFile<FavoriteSong[]>(favoriteSongsPath),
  ]);

  return { photoAlbums, favoriteSongs };
}

async function scanAssets(): Promise<ScannedAssets> {
  const [jeju, xinjiang, street, covers] = await Promise.all([
    scanPublicFolder(photoFolderConfig.jeju),
    scanPublicFolder(photoFolderConfig.xinjiang),
    scanPublicFolder(photoFolderConfig.street),
    scanPublicFolder(["cover"]),
  ]);

  return {
    photos: { jeju, xinjiang, street },
    covers,
  };
}

function isNonEmptyString(value: unknown) {
  return typeof value === "string" && value.trim().length > 0;
}

function validateContent(payload: AdminContentPayload) {
  const errors: string[] = [];

  if (!Array.isArray(payload.photoAlbums)) {
    errors.push("photoAlbums must be an array.");
  } else {
    const seenAlbumIds = new Set<string>();

    payload.photoAlbums.forEach((album, albumIndex) => {
      const label = `photoAlbums[${albumIndex}]`;

      if (!albumIds.includes(album.id)) {
        errors.push(`${label}.id is invalid.`);
      }

      if (seenAlbumIds.has(album.id)) {
        errors.push(`${label}.id is duplicated.`);
      }
      seenAlbumIds.add(album.id);

      if (!isNonEmptyString(album.title)) errors.push(`${label}.title is required.`);
      if (!isNonEmptyString(album.location)) {
        errors.push(`${label}.location is required.`);
      }
      if (!isNonEmptyString(album.description)) {
        errors.push(`${label}.description is required.`);
      }
      if (typeof album.note !== "string") {
        errors.push(`${label}.note must be a string.`);
      }
      if (!stickerPresets.includes(album.stickerPreset)) {
        errors.push(`${label}.stickerPreset is invalid.`);
      }
      if (!Array.isArray(album.photos)) {
        errors.push(`${label}.photos must be an array.`);
        return;
      }

      album.photos.forEach((photo, photoIndex) => {
        const photoLabel = `${label}.photos[${photoIndex}]`;
        if (!isNonEmptyString(photo.src)) {
          errors.push(`${photoLabel}.src is required.`);
        }
        if (typeof photo.story !== "string") {
          errors.push(`${photoLabel}.story must be a string.`);
        }
      });
    });

    albumIds.forEach((albumId) => {
      if (!seenAlbumIds.has(albumId)) {
        errors.push(`photoAlbums is missing ${albumId}.`);
      }
    });
  }

  if (!Array.isArray(payload.favoriteSongs)) {
    errors.push("favoriteSongs must be an array.");
  } else {
    payload.favoriteSongs.forEach((song, songIndex) => {
      const label = `favoriteSongs[${songIndex}]`;

      if (!isNonEmptyString(song.title)) errors.push(`${label}.title is required.`);
      if (!isNonEmptyString(song.artist)) {
        errors.push(`${label}.artist is required.`);
      }
      if (!isNonEmptyString(song.coverUrl)) {
        errors.push(`${label}.coverUrl is required.`);
      }
      if (typeof song.lyrics !== "string") {
        errors.push(`${label}.lyrics must be a string.`);
      }
      if (!tapeColors.includes(song.tapeColor)) {
        errors.push(`${label}.tapeColor is invalid.`);
      }
    });
  }

  return errors;
}

export async function GET() {
  if (isProduction()) return localOnlyResponse();

  const [content, assets] = await Promise.all([loadContent(), scanAssets()]);
  return NextResponse.json({ ...content, assets });
}

export async function PUT(request: NextRequest) {
  if (isProduction()) return localOnlyResponse();

  let payload: AdminContentPayload;

  try {
    payload = (await request.json()) as AdminContentPayload;
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const errors = validateContent(payload);
  if (errors.length > 0) {
    return NextResponse.json({ error: "Content validation failed.", errors }, { status: 400 });
  }

  await Promise.all([
    writeFile(photoAlbumsPath, `${JSON.stringify(payload.photoAlbums, null, 2)}\n`, "utf8"),
    writeFile(
      favoriteSongsPath,
      `${JSON.stringify(payload.favoriteSongs, null, 2)}\n`,
      "utf8"
    ),
  ]);

  const assets = await scanAssets();
  return NextResponse.json({ ...payload, assets });
}
