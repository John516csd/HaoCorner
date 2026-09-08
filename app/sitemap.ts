import type { MetadataRoute } from 'next'
import { musicArtists } from './components/vinyl-room/artists'

export default function sitemap(): MetadataRoute.Sitemap {
  return ['', '/music', ...musicArtists.map(artist => `/${artist.id}`)].map(path => ({
    url: `https://yanchenhao.com${path}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: path ? 0.7 : 1,
  }))
}
