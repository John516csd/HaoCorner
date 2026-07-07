import favoriteSongsData from "./content/favorite-songs.json";
import photoAlbumsData from "./content/photo-albums.json";

export type TapeColor = "red" | "blue" | "yellow" | "green" | "pink" | "white";
export type PostItColor = "yellow" | "blue" | "pink" | "green";
export type AlbumStickerPreset = "sichuan" | "jeju" | "xinjiang" | "street";

export type FavoriteSong = {
  title: string;
  artist: string;
  coverUrl: string;
  lyrics: string;
  tapeColor: TapeColor;
};

export type TimelineItem = {
  id: "origin" | "education" | "career" | "life";
  year: string;
  range: string;
  title: string;
  description: string;
  imageUrl: string;
  postItColor: PostItColor;
  polaroidRotation: number;
  postItRotation: number;
};

export type AlbumPhoto = {
  src: string;
  story: string;
};

export type PhotoAlbum = {
  id: "sichuan" | "jeju" | "xinjiang" | "street";
  title: string;
  location: string;
  date?: string;
  description: string;
  note: string;
  stickerPreset: AlbumStickerPreset;
  photos: AlbumPhoto[];
};

export const heroPhotoUrl = "/images/me.jpg";
export const siteUrl = "https://yanchenhao.com";
export const photoStoryPlaceholder = "";

export const favoriteSongs = favoriteSongsData as FavoriteSong[];

export const timelineData: TimelineItem[] = [
  {
    id: "origin",
    year: "2000",
    range: "— 2018",
    title: "Roots in Zhaoqing",
    description:
      "Born in Zhaoqing, I spent my first 18 years there, from primary school to high school. Home gave me warmth, patience, and the first spark to look further.",
    imageUrl: "/images/childhood-zhaoqing.jpg",
    postItColor: "yellow",
    polaroidRotation: -3,
    postItRotation: 2,
  },
  {
    id: "education",
    year: "2018",
    range: "— 2022",
    title: "University in Guangzhou",
    description:
      "Studied Software Engineering at Guangdong Polytechnic Normal University in Tianhe, Guangzhou. Earned my bachelor's degree through four years of classes, projects, and debugging.",
    imageUrl: "/images/university-graduation.jpg",
    postItColor: "blue",
    polaroidRotation: 3,
    postItRotation: -2,
  },
  {
    id: "career",
    year: "2022",
    range: "— Now",
    title: "Frontend Engineer",
    description:
      "Started as a frontend intern at Sangfor, then joined Notta as a frontend engineer. Since 2022, I've been building product experiences for real users.",
    imageUrl: "/images/workstation.webp",
    postItColor: "pink",
    polaroidRotation: -2,
    postItRotation: -3,
  },
  {
    id: "life",
    year: "Always",
    range: "",
    title: "Life Beyond Code",
    description:
      "I love making things with code, but I also want to keep moving: across oceans, toward snow mountains, with music in my ears and a camera nearby.",
    imageUrl: "/images/snow-mountain-journey.webp",
    postItColor: "green",
    polaroidRotation: 4,
    postItRotation: 3,
  },
];

export const photoAlbums = photoAlbumsData as PhotoAlbum[];
