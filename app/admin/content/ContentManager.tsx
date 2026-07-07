"use client";

import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  ImagePlus,
  Images,
  Loader2,
  Music2,
  Plus,
  RefreshCw,
  Save,
  Trash2,
  UploadCloud,
} from "lucide-react";
import {
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type {
  AlbumStickerPreset,
  FavoriteSong,
  PhotoAlbum,
  TapeColor,
} from "../../data/home";
import { cn } from "../../lib/utils";

type TabId = "photos" | "music";
type SaveState = "loading" | "saved" | "unsaved" | "saving" | "error";
type AlbumId = PhotoAlbum["id"];

type ScannedAssets = {
  photos: Record<AlbumId, string[]>;
  covers: string[];
};

type AdminContent = {
  photoAlbums: PhotoAlbum[];
  favoriteSongs: FavoriteSong[];
  assets: ScannedAssets;
};

const inputClassName =
  "w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10";

const textareaClassName =
  "w-full resize-y rounded-md border border-gray-200 bg-white px-3 py-2 text-sm leading-6 text-gray-900 shadow-sm outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10";

const buttonClassName =
  "inline-flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/15 disabled:!border-gray-200 disabled:!bg-gray-100 disabled:!text-gray-400 disabled:!shadow-none disabled:!opacity-100 disabled:cursor-not-allowed";

const albumLabels: Record<AlbumId, string> = {
  sichuan: "Sichuan",
  jeju: "Jeju",
  xinjiang: "Xinjiang",
  street: "Street Vibes",
};

const albumPublicFolders: Record<AlbumId, string> = {
  sichuan: "public/sichuan/optimized",
  jeju: "public/jeju/optimized",
  xinjiang: "public/xinjiang/optimized",
  street: "public/street-vibe/optimized",
};

const stickerPresets: AlbumStickerPreset[] = [
  "sichuan",
  "jeju",
  "xinjiang",
  "street",
];
const tapeColors: TapeColor[] = [
  "red",
  "blue",
  "yellow",
  "green",
  "pink",
  "white",
];

const tapeColorClasses: Record<TapeColor, string> = {
  red: "bg-red-300",
  blue: "bg-blue-300",
  yellow: "bg-yellow-300",
  green: "bg-green-300",
  pink: "bg-pink-300",
  white: "bg-white",
};

function fileNameFromSrc(src: string) {
  return src.split("/").pop() || src;
}

function moveItem<T>(items: T[], index: number, direction: -1 | 1) {
  const nextIndex = index + direction;
  if (nextIndex < 0 || nextIndex >= items.length) return items;

  const nextItems = [...items];
  const currentItem = nextItems[index];
  nextItems[index] = nextItems[nextIndex];
  nextItems[nextIndex] = currentItem;
  return nextItems;
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="grid gap-1.5 text-sm font-medium text-gray-700">
      <span>{label}</span>
      {children}
    </label>
  );
}

function IconButton({
  children,
  onClick,
  disabled,
  title,
}: {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  title: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="inline-flex h-10 w-10 items-center justify-center rounded-md border !border-gray-300 !bg-white !text-gray-800 shadow-sm transition hover:!border-gray-500 hover:!bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/15 disabled:cursor-not-allowed disabled:!border-gray-200 disabled:!bg-gray-100 disabled:!text-gray-400 disabled:shadow-none"
    >
      {children}
      <span className="sr-only">{title}</span>
    </button>
  );
}

function StatusPill({ state }: { state: SaveState }) {
  const label =
    state === "loading"
      ? "Loading"
      : state === "saving"
        ? "Saving"
        : state === "unsaved"
          ? "Unsaved"
          : state === "error"
            ? "Error"
            : "Saved";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium",
        state === "saved" && "border-emerald-200 bg-emerald-50 text-emerald-700",
        state === "unsaved" && "border-amber-200 bg-amber-50 text-amber-800",
        state === "saving" && "border-blue-200 bg-blue-50 text-blue-700",
        state === "loading" && "border-gray-200 bg-gray-50 text-gray-600",
        state === "error" && "border-red-200 bg-red-50 text-red-700"
      )}
    >
      {state === "saving" || state === "loading" ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <CheckCircle2 size={16} />
      )}
      {label}
    </span>
  );
}

export function ContentManager() {
  const photoUploadInputRef = useRef<HTMLInputElement | null>(null);
  const [content, setContent] = useState<AdminContent | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("photos");
  const [selectedAlbumId, setSelectedAlbumId] = useState<AlbumId>("jeju");
  const [selectedSongIndex, setSelectedSongIndex] = useState(0);
  const [saveState, setSaveState] = useState<SaveState>("loading");
  const [isUploadingPhotos, setIsUploadingPhotos] = useState(false);
  const [message, setMessage] = useState("");

  const selectedAlbum = useMemo(
    () =>
      content?.photoAlbums.find((album) => album.id === selectedAlbumId) ||
      content?.photoAlbums[0] ||
      null,
    [content?.photoAlbums, selectedAlbumId]
  );

  const selectedSong =
    content?.favoriteSongs[selectedSongIndex] ||
    content?.favoriteSongs[0] ||
    null;

  const missingPhotos = useMemo(() => {
    if (!content || !selectedAlbum) return [];

    const existingPhotos = new Set(
      selectedAlbum.photos.map((photo) => photo.src)
    );
    return (content.assets.photos[selectedAlbum.id] || []).filter(
      (src) => !existingPhotos.has(src)
    );
  }, [content, selectedAlbum]);

  useEffect(() => {
    let ignore = false;

    async function loadContent() {
      try {
        const response = await fetch("/api/admin/content", {
          cache: "no-store",
        });
        const data = (await response.json()) as AdminContent & {
          error?: string;
        };

        if (!response.ok) {
          throw new Error(data.error || "Failed to load content.");
        }

        if (ignore) return;
        setContent(data);
        setSelectedAlbumId(data.photoAlbums[0]?.id || "jeju");
        setSelectedSongIndex(0);
        setSaveState("saved");
        setMessage("");
      } catch (error) {
        if (ignore) return;
        setSaveState("error");
        setMessage(error instanceof Error ? error.message : "Load failed.");
      }
    }

    loadContent();
    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    const hasUnsavedChanges = saveState === "unsaved";
    if (!hasUnsavedChanges) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [saveState]);

  function markDirty() {
    setSaveState("unsaved");
    setMessage("");
  }

  function updateAlbum(
    albumId: AlbumId,
    updater: (album: PhotoAlbum) => PhotoAlbum
  ) {
    setContent((current) => {
      if (!current) return current;
      return {
        ...current,
        photoAlbums: current.photoAlbums.map((album) =>
          album.id === albumId ? updater(album) : album
        ),
      };
    });
    markDirty();
  }

  function updateAlbumField<K extends keyof PhotoAlbum>(
    field: K,
    value: PhotoAlbum[K]
  ) {
    if (!selectedAlbum) return;
    updateAlbum(selectedAlbum.id, (album) => ({ ...album, [field]: value }));
  }

  function updatePhoto(
    albumId: AlbumId,
    photoIndex: number,
    patch: Partial<PhotoAlbum["photos"][number]>
  ) {
    updateAlbum(albumId, (album) => ({
      ...album,
      photos: album.photos.map((photo, index) =>
        index === photoIndex ? { ...photo, ...patch } : photo
      ),
    }));
  }

  function movePhoto(albumId: AlbumId, photoIndex: number, direction: -1 | 1) {
    updateAlbum(albumId, (album) => ({
      ...album,
      photos: moveItem(album.photos, photoIndex, direction),
    }));
  }

  function removePhoto(albumId: AlbumId, photoIndex: number) {
    updateAlbum(albumId, (album) => ({
      ...album,
      photos: album.photos.filter((_, index) => index !== photoIndex),
    }));
  }

  function addPhoto(albumId: AlbumId, src: string) {
    updateAlbum(albumId, (album) => ({
      ...album,
      photos: [...album.photos, { src, story: "" }],
    }));
  }

  async function uploadPhotos(fileList: FileList | null) {
    if (!content || !selectedAlbum || !fileList?.length || isUploadingPhotos) {
      return;
    }

    const files = Array.from(fileList);
    const formData = new FormData();
    formData.append("albumId", selectedAlbum.id);
    files.forEach((file) => formData.append("files", file));

    setIsUploadingPhotos(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/content", {
        method: "POST",
        body: formData,
      });
      const data = (await response.json()) as {
        uploaded?: string[];
        assets?: ScannedAssets;
        error?: string;
        errors?: string[];
      };

      if (!response.ok) {
        const details = data.errors?.length ? ` ${data.errors.join(" ")}` : "";
        throw new Error(`${data.error || "Upload failed."}${details}`);
      }

      const uploaded = data.uploaded || [];
      const uploadedSet = new Set(uploaded);

      setContent((current) => {
        if (!current) return current;

        return {
          ...current,
          assets: data.assets || current.assets,
          photoAlbums: current.photoAlbums.map((album) => {
            if (album.id !== selectedAlbum.id) return album;

            const existingPhotos = new Set(album.photos.map((photo) => photo.src));
            const nextPhotos = uploaded
              .filter((src) => !existingPhotos.has(src))
              .map((src) => ({ src, story: "" }));

            return {
              ...album,
              photos: [...album.photos, ...nextPhotos],
            };
          }),
        };
      });

      setSaveState("unsaved");
      setMessage(
        `Uploaded ${uploadedSet.size} photo${uploadedSet.size === 1 ? "" : "s"} to ${albumPublicFolders[selectedAlbum.id]}. Click Save to update JSON.`
      );

      if (data.errors?.length) {
        setMessage((current) => `${current} Skipped: ${data.errors?.join(" ")}`);
      }
    } catch (error) {
      setSaveState("error");
      setMessage(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setIsUploadingPhotos(false);
      if (photoUploadInputRef.current) {
        photoUploadInputRef.current.value = "";
      }
    }
  }

  function updateSong(index: number, patch: Partial<FavoriteSong>) {
    setContent((current) => {
      if (!current) return current;
      return {
        ...current,
        favoriteSongs: current.favoriteSongs.map((song, songIndex) =>
          songIndex === index ? { ...song, ...patch } : song
        ),
      };
    });
    markDirty();
  }

  function moveSong(index: number, direction: -1 | 1) {
    const nextIndex = index + direction;
    if (!content || nextIndex < 0 || nextIndex >= content.favoriteSongs.length) {
      return;
    }

    setContent({
      ...content,
      favoriteSongs: moveItem(content.favoriteSongs, index, direction),
    });
    setSelectedSongIndex(nextIndex);
    markDirty();
  }

  function addSong() {
    if (!content) return;

    setContent({
      ...content,
      favoriteSongs: [
        ...content.favoriteSongs,
        {
          title: "",
          artist: "",
          coverUrl: content.assets.covers[0] || "",
          lyrics: "",
          tapeColor: "yellow",
        },
      ],
    });
    setSelectedSongIndex(content.favoriteSongs.length);
    markDirty();
  }

  async function refreshContent() {
    if (saveState === "unsaved") return;

    setSaveState("loading");
    setMessage("");

    try {
      const response = await fetch("/api/admin/content", { cache: "no-store" });
      const data = (await response.json()) as AdminContent & { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Failed to refresh content.");
      }

      setContent(data);
      setSelectedAlbumId(data.photoAlbums[0]?.id || "jeju");
      setSelectedSongIndex(0);
      setSaveState("saved");
    } catch (error) {
      setSaveState("error");
      setMessage(error instanceof Error ? error.message : "Refresh failed.");
    }
  }

  async function saveContent() {
    if (!content || saveState === "saving") return;

    setSaveState("saving");
    setMessage("");

    try {
      const response = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          photoAlbums: content.photoAlbums,
          favoriteSongs: content.favoriteSongs,
        }),
      });
      const data = (await response.json()) as AdminContent & {
        error?: string;
        errors?: string[];
      };

      if (!response.ok) {
        const details = data.errors?.length ? ` ${data.errors.join(" ")}` : "";
        throw new Error(`${data.error || "Save failed."}${details}`);
      }

      setContent(data);
      setSaveState("saved");
      setMessage("Saved to JSON.");
    } catch (error) {
      setSaveState("error");
      setMessage(error instanceof Error ? error.message : "Save failed.");
    }
  }

  return (
    <div className="min-h-screen bg-[#f6f4ee] text-gray-900">
      <header className="sticky top-0 z-20 border-b border-black/10 bg-[#f6f4ee]/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-500">
              Local only
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-gray-950 sm:text-3xl">
              Content Manager
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <StatusPill state={saveState} />
            <button
              type="button"
              onClick={refreshContent}
              disabled={saveState === "loading" || saveState === "unsaved"}
              className={cn(
                buttonClassName,
                "border !border-gray-300 !bg-white !text-gray-800 shadow-sm hover:!border-gray-500 hover:!bg-gray-50"
              )}
            >
              <RefreshCw size={17} />
              Refresh
            </button>
            <button
              type="button"
              onClick={saveContent}
              disabled={!content || saveState === "loading" || saveState === "saving"}
              className={cn(
                buttonClassName,
                "border !border-gray-950 !bg-gray-950 !text-white shadow-sm hover:!bg-gray-800"
              )}
            >
              <Save size={17} />
              Save
            </button>
          </div>
        </div>
        {message && (
          <div className="mx-auto max-w-7xl px-4 pb-4 text-sm text-gray-600 sm:px-6 lg:px-8">
            {message}
          </div>
        )}
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 inline-flex rounded-lg border border-gray-300 bg-white p-1 shadow-sm">
          <button
            type="button"
            onClick={() => setActiveTab("photos")}
            className={cn(
              buttonClassName,
              activeTab === "photos"
                ? "border !border-gray-950 !bg-gray-950 !text-white shadow-sm"
                : "border !border-transparent !bg-transparent !text-gray-700 hover:!bg-gray-50"
            )}
          >
            <Images size={17} />
            Photos
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("music")}
            className={cn(
              buttonClassName,
              activeTab === "music"
                ? "border !border-gray-950 !bg-gray-950 !text-white shadow-sm"
                : "border !border-transparent !bg-transparent !text-gray-700 hover:!bg-gray-50"
            )}
          >
            <Music2 size={17} />
            Music
          </button>
        </div>

        {saveState === "loading" && !content ? (
          <div className="flex min-h-[20rem] items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white/70 text-gray-500">
            <Loader2 className="mr-2 animate-spin" size={18} />
            Loading content
          </div>
        ) : null}

        {content && activeTab === "photos" && selectedAlbum ? (
          <section className="grid gap-6 lg:grid-cols-[18rem_1fr]">
            <aside className="h-fit rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
              <div className="mb-3 px-2 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                Albums
              </div>
              <div className="grid gap-2">
                {content.photoAlbums.map((album) => (
                  <button
                    key={album.id}
                    type="button"
                    onClick={() => setSelectedAlbumId(album.id)}
                    className={cn(
                      "relative rounded-md border border-l-4 px-3 py-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/15",
                      selectedAlbum.id === album.id
                        ? "!border-gray-300 !border-l-gray-950 !bg-[#f3f1ea] !text-gray-950 shadow-sm"
                        : "!border-gray-200 !border-l-transparent !bg-white !text-gray-800 hover:!border-gray-300 hover:!bg-gray-50"
                    )}
                  >
                    <div className="font-medium">{album.title || albumLabels[album.id]}</div>
                    <div
                      className={cn(
                        "mt-1 text-xs",
                        selectedAlbum.id === album.id
                          ? "text-gray-600"
                          : "text-gray-500"
                      )}
                    >
                      {album.photos.length} photos
                    </div>
                  </button>
                ))}
              </div>
            </aside>

            <div className="grid gap-6">
              <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Title">
                    <input
                      value={selectedAlbum.title}
                      onChange={(event) =>
                        updateAlbumField("title", event.target.value)
                      }
                      className={inputClassName}
                    />
                  </Field>
                  <Field label="Location">
                    <input
                      value={selectedAlbum.location}
                      onChange={(event) =>
                        updateAlbumField("location", event.target.value)
                      }
                      className={inputClassName}
                    />
                  </Field>
                  <Field label="Date">
                    <input
                      value={selectedAlbum.date || ""}
                      onChange={(event) =>
                        updateAlbumField("date", event.target.value)
                      }
                      className={inputClassName}
                      placeholder="2026-04"
                    />
                  </Field>
                  <Field label="Sticker preset">
                    <select
                      value={selectedAlbum.stickerPreset}
                      onChange={(event) =>
                        updateAlbumField(
                          "stickerPreset",
                          event.target.value as AlbumStickerPreset
                        )
                      }
                      className={inputClassName}
                    >
                      {stickerPresets.map((preset) => (
                        <option key={preset} value={preset}>
                          {preset}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <div className="md:col-span-2">
                    <Field label="Description">
                      <textarea
                        value={selectedAlbum.description}
                        onChange={(event) =>
                          updateAlbumField("description", event.target.value)
                        }
                        rows={3}
                        className={textareaClassName}
                      />
                    </Field>
                  </div>
                  <div className="md:col-span-2">
                    <Field label="Note">
                        <textarea
                          value={selectedAlbum.note}
                          onChange={(event) =>
                            updateAlbumField("note", event.target.value)
                          }
                          rows={2}
                          placeholder="Optional note"
                          className={textareaClassName}
                        />
                    </Field>
                  </div>
                </div>
              </section>

              <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold">Photos</h2>
                    <p className="text-sm text-gray-500">
                      {selectedAlbum.photos.length} in JSON, {missingPhotos.length} new in folder
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      Upload here or drop files into {albumPublicFolders[selectedAlbum.id]}.
                    </p>
                  </div>
                  <div>
                    <input
                      ref={photoUploadInputRef}
                      type="file"
                      multiple
                      accept="image/avif,image/gif,image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={(event) => uploadPhotos(event.target.files)}
                    />
                    <button
                      type="button"
                      onClick={() => photoUploadInputRef.current?.click()}
                      disabled={isUploadingPhotos || saveState === "saving"}
                      className={cn(
                        buttonClassName,
                        "border !border-gray-300 !bg-white !text-gray-800 shadow-sm hover:!border-gray-500 hover:!bg-gray-50"
                      )}
                    >
                      {isUploadingPhotos ? (
                        <Loader2 size={17} className="animate-spin" />
                      ) : (
                        <UploadCloud size={17} />
                      )}
                      Upload images
                    </button>
                  </div>
                </div>

                {missingPhotos.length > 0 && (
                  <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
                    <div className="mb-3 text-sm font-semibold text-amber-900">
                      Folder files not in JSON
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                      {missingPhotos.map((src) => (
                        <div
                          key={src}
                          className="flex items-center gap-3 rounded-md bg-white p-2 shadow-sm"
                        >
                          <img
                            src={src}
                            alt=""
                            className="h-14 w-16 rounded object-cover"
                            loading="lazy"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-sm font-medium">
                              {fileNameFromSrc(src)}
                            </div>
                            <div className="truncate text-xs text-gray-500">{src}</div>
                          </div>
                          <IconButton
                            title="Add photo"
                            onClick={() => addPhoto(selectedAlbum.id, src)}
                          >
                            <ImagePlus size={17} />
                          </IconButton>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid gap-3">
                  {selectedAlbum.photos.length === 0 && missingPhotos.length === 0 && (
                    <div className="rounded-lg border border-dashed border-gray-300 bg-[#fbfaf6] p-6 text-sm text-gray-500">
                      No photos yet. Use Upload images, then click Save once they
                      appear in this album.
                    </div>
                  )}

                  {selectedAlbum.photos.map((photo, photoIndex) => (
                    <div
                      key={`${photo.src}-${photoIndex}`}
                      className="grid gap-3 rounded-lg border border-gray-200 bg-[#fbfaf6] p-3 md:grid-cols-[6rem_1fr_auto]"
                    >
                      <img
                        src={photo.src}
                        alt=""
                        className="h-24 w-full rounded-md object-cover md:w-24"
                        loading="lazy"
                      />
                      <div className="grid gap-3">
                        <Field label={`Photo ${photoIndex + 1}`}>
                          <input
                            value={photo.src}
                            onChange={(event) =>
                              updatePhoto(selectedAlbum.id, photoIndex, {
                                src: event.target.value,
                              })
                            }
                            className={inputClassName}
                          />
                        </Field>
                        <Field label="Story">
                          <textarea
                            value={photo.story}
                            onChange={(event) =>
                              updatePhoto(selectedAlbum.id, photoIndex, {
                                story: event.target.value,
                              })
                            }
                            rows={2}
                            placeholder="Optional photo story"
                            className={textareaClassName}
                          />
                        </Field>
                      </div>
                      <div className="flex items-start gap-2 md:flex-col">
                        <IconButton
                          title="Move up"
                          disabled={photoIndex === 0}
                          onClick={() =>
                            movePhoto(selectedAlbum.id, photoIndex, -1)
                          }
                        >
                          <ArrowUp size={17} />
                        </IconButton>
                        <IconButton
                          title="Move down"
                          disabled={photoIndex === selectedAlbum.photos.length - 1}
                          onClick={() =>
                            movePhoto(selectedAlbum.id, photoIndex, 1)
                          }
                        >
                          <ArrowDown size={17} />
                        </IconButton>
                        <IconButton
                          title="Remove from JSON"
                          onClick={() => removePhoto(selectedAlbum.id, photoIndex)}
                        >
                          <Trash2 size={17} />
                        </IconButton>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </section>
        ) : null}

        {content && activeTab === "music" ? (
          <section className="grid gap-6 lg:grid-cols-[22rem_1fr]">
            <aside className="h-fit rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
              <div className="mb-3 flex items-center justify-between gap-3 px-2">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                  Songs
                </div>
                <button
                  type="button"
                  onClick={addSong}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md border !border-gray-950 !bg-gray-950 !text-white shadow-sm transition hover:!bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/15"
                  title="Add song"
                >
                  <Plus size={16} />
                  <span className="sr-only">Add song</span>
                </button>
              </div>
              <div className="grid gap-2">
                {content.favoriteSongs.map((song, songIndex) => (
                  <button
                    key={`${song.title}-${songIndex}`}
                    type="button"
                    onClick={() => setSelectedSongIndex(songIndex)}
                    className={cn(
                      "relative rounded-md border border-l-4 px-3 py-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/15",
                      selectedSongIndex === songIndex
                        ? "!border-gray-300 !border-l-gray-950 !bg-[#f3f1ea] !text-gray-950 shadow-sm"
                        : "!border-gray-200 !border-l-transparent !bg-white !text-gray-800 hover:!border-gray-300 hover:!bg-gray-50"
                    )}
                  >
                    <div className="truncate font-medium">
                      {song.title || "Untitled song"}
                    </div>
                    <div
                      className={cn(
                        "mt-1 truncate text-xs",
                        selectedSongIndex === songIndex
                          ? "text-gray-600"
                          : "text-gray-500"
                      )}
                    >
                      {song.artist || "No artist"}
                    </div>
                  </button>
                ))}
              </div>
            </aside>

            {selectedSong && (
              <div className="grid gap-6 xl:grid-cols-[1fr_20rem]">
                <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                    <h2 className="text-lg font-semibold">Song details</h2>
                    <div className="flex gap-2">
                      <IconButton
                        title="Move up"
                        disabled={selectedSongIndex === 0}
                        onClick={() => moveSong(selectedSongIndex, -1)}
                      >
                        <ArrowUp size={17} />
                      </IconButton>
                      <IconButton
                        title="Move down"
                        disabled={
                          selectedSongIndex === content.favoriteSongs.length - 1
                        }
                        onClick={() => moveSong(selectedSongIndex, 1)}
                      >
                        <ArrowDown size={17} />
                      </IconButton>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Title">
                      <input
                        value={selectedSong.title}
                        onChange={(event) =>
                          updateSong(selectedSongIndex, {
                            title: event.target.value,
                          })
                        }
                        className={inputClassName}
                      />
                    </Field>
                    <Field label="Artist">
                      <input
                        value={selectedSong.artist}
                        onChange={(event) =>
                          updateSong(selectedSongIndex, {
                            artist: event.target.value,
                          })
                        }
                        className={inputClassName}
                      />
                    </Field>
                    <Field label="Cover URL">
                      <input
                        value={selectedSong.coverUrl}
                        onChange={(event) =>
                          updateSong(selectedSongIndex, {
                            coverUrl: event.target.value,
                          })
                        }
                        className={inputClassName}
                      />
                    </Field>
                    <Field label="Tape color">
                      <select
                        value={selectedSong.tapeColor}
                        onChange={(event) =>
                          updateSong(selectedSongIndex, {
                            tapeColor: event.target.value as TapeColor,
                          })
                        }
                        className={inputClassName}
                      >
                        {tapeColors.map((color) => (
                          <option key={color} value={color}>
                            {color}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <div className="md:col-span-2">
                      <Field label="Lyrics">
                        <textarea
                          value={selectedSong.lyrics}
                          onChange={(event) =>
                            updateSong(selectedSongIndex, {
                              lyrics: event.target.value,
                            })
                          }
                          rows={5}
                          className={textareaClassName}
                        />
                      </Field>
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="mb-3 text-sm font-semibold text-gray-700">
                      Covers
                    </div>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                      {content.assets.covers.map((cover) => (
                        <button
                          key={cover}
                          type="button"
                          onClick={() =>
                            updateSong(selectedSongIndex, { coverUrl: cover })
                          }
                          className={cn(
                            "rounded-lg border !bg-white p-2 text-left shadow-sm transition hover:!border-gray-400",
                            selectedSong.coverUrl === cover
                              ? "!border-gray-950 ring-2 ring-gray-950/10"
                              : "!border-gray-200"
                          )}
                        >
                          <img
                            src={cover}
                            alt=""
                            className="aspect-square w-full rounded-md object-cover"
                            loading="lazy"
                          />
                          <div className="mt-2 truncate text-xs text-gray-600">
                            {fileNameFromSrc(cover)}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </section>

                <aside className="h-fit rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="mb-4 text-sm font-semibold text-gray-700">
                    Preview
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-[#fbfaf6] p-4">
                    <div className="relative mx-auto aspect-square w-full max-w-[14rem] overflow-hidden rounded-md bg-gray-100">
                      {selectedSong.coverUrl ? (
                        <img
                          src={selectedSong.coverUrl}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : null}
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                      <span
                        className={cn(
                          "h-4 w-10 rounded-sm border border-black/10",
                          tapeColorClasses[selectedSong.tapeColor]
                        )}
                      />
                      <span className="text-xs uppercase tracking-[0.18em] text-gray-500">
                        {selectedSong.tapeColor}
                      </span>
                    </div>
                    <h3 className="mt-3 text-xl font-semibold text-gray-950">
                      {selectedSong.title || "Untitled song"}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {selectedSong.artist || "No artist"}
                    </p>
                    <p className="mt-4 whitespace-pre-line rounded-md bg-white p-3 text-sm leading-6 text-gray-700">
                      {selectedSong.lyrics || "No lyrics yet."}
                    </p>
                  </div>
                </aside>
              </div>
            )}
          </section>
        ) : null}
      </main>
    </div>
  );
}
