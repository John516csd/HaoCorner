import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { findMusicArtist, musicArtists } from '../../components/vinyl-room/artists';

export const dynamicParams = false;
export function generateStaticParams() { return musicArtists.map(({ id }) => ({ artist: id })); }

export async function generateMetadata({ params }: { params: Promise<{ artist: string }> }): Promise<Metadata> {
  const artist = findMusicArtist((await params).artist);
  if (!artist) notFound();
  const title = `黑胶室 · ${artist.english} on record`;
  const description = artist.description;
  const images = [{ url: artist.cover, alt: `${artist.name}唱片收藏` }];
  return { title, description, alternates: { canonical: `/${artist.id}` },
    openGraph: { title, description, url: `/${artist.id}`, locale: 'zh_CN', type: 'website', images },
    twitter: { card: 'summary_large_image', title, description, images } };
}

export default async function ArtistPage({ params }: { params: Promise<{ artist: string }> }) {
  if (!findMusicArtist((await params).artist)) notFound();
  return null;
}
