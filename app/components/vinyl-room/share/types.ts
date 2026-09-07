import type { VinylAlbum } from '../types';

export type VinylTrack = VinylAlbum['tracks'][number];
export type ShareFormat = 'single' | 'grid';
export type ShareStyle = 'color' | 'ambient';
export type Draft = { quote: string; note: string; signature: string; format: ShareFormat; style: ShareStyle };
export type LyricCandidate = { id: number; title: string; artist: string; album: string; duration: number; lyrics: string; exact: boolean };
export type ShareFile = { name: string; blob: Blob; url: string };
export const MAX_QUOTE = 140;
export const MAX_NOTE = 120;
export const emptyDraft: Draft = { quote: '', note: '', signature: '', format: 'single', style: 'color' };
export const draftKey = (trackId: number) => `haocorner:lyric-share:v1:${trackId}`;

export function readDraft(trackId: number): Draft {
  try {
    const value = JSON.parse(localStorage.getItem(draftKey(trackId)) || 'null');
    if (!value || typeof value !== 'object') return { ...emptyDraft };
    return {
      quote: typeof value.quote === 'string' && value.quote.length <= MAX_QUOTE ? value.quote : '',
      note: typeof value.note === 'string' && value.note.length <= MAX_NOTE ? value.note : '',
      signature: typeof value.signature === 'string' && value.signature.length <= 24 ? value.signature : '',
      format: value.format === 'grid' ? 'grid' : 'single', style: value.style === 'ambient' ? 'ambient' : 'color',
    };
  } catch { return { ...emptyDraft }; }
}
