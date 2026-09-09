export type VinylAlbum = {
  id: string;
  title: string;
  artist: string;
  year: number;
  artwork: string;
  thumbnail?: string;
  background: string;
  sourceUrl: string;
  musicUrl: string;
  color: string;
  textColor: string;
  songCount: number;
  unreturnedItemCount: number;
  musicNote: string;
  totalSongTimeMillis: number;
  copyright: string;
  tracks: {
    trackId: number;
    trackName: string;
    trackNumber: number;
    trackTimeMillis: number;
    musicUrl: string | null;
  }[];
};
