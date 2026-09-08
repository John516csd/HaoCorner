import { NextRequest, NextResponse } from 'next/server';
import { findMusicArtist } from '../../components/vinyl-room/artists';
import { matchLyrics, traditional } from '../../components/vinyl-room/share/lyrics-match.mjs';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const room = request.nextUrl.searchParams.get('room');
  const trackId = Number(request.nextUrl.searchParams.get('track'));
  const albums = findMusicArtist(room)?.albums || [];
  const album = albums.find(item => item.tracks.some(track => track.trackId === trackId));
  const track = album?.tracks.find(item => item.trackId === trackId);
  if (!album || !track) return NextResponse.json({ error: '未找到这首歌曲。' }, { status: 404 });

  const queries = Array.from(new Set([track.trackName, traditional(track.trackName)]));
  const results = await Promise.allSettled(queries.map(async name => {
    const params = new URLSearchParams({ track_name: name, artist_name: traditional(album.artist) });
    const response = await fetch(`https://lrclib.net/api/search?${params}`, {
      headers: { 'User-Agent': 'HaoCorner/0.1 (https://yanchenhao.com)' },
      signal: AbortSignal.timeout(9000), next: { revalidate: 86400 },
    });
    if (!response.ok) throw new Error(`Lyrics provider: ${response.status}`);
    const data = await response.json();
    if (!Array.isArray(data)) throw new Error('Unexpected lyrics response');
    return data;
  }));
  const successful = results.filter((result): result is PromiseFulfilledResult<any[]> => result.status === 'fulfilled');
  if (!successful.length) return NextResponse.json({ error: '歌词服务暂时没有响应，可以重试或粘贴歌词。' }, { status: 502 });
  return NextResponse.json({ candidates: matchLyrics(successful.flatMap(result => result.value), album, track) }, {
    headers: { 'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400' },
  });
}
