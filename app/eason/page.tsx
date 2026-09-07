import type { Metadata } from 'next'
import VinylRoom from '../modules/eason-page/vinyl-room'

const title = '黑胶室 · Eason on record'
const description = '滚动翻阅陈奕迅的十二张专辑，点击唱片查看歌曲，在 Apple Music 打开收藏的声音。'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/eason' },
  openGraph: {
    title,
    description,
    url: '/eason',
    locale: 'zh_CN',
    type: 'website',
    images: [{ url: '/eason/covers/u87.webp', width: 1200, height: 1070, alt: '陈奕迅 U87 专辑封面' }],
  },
  twitter: { card: 'summary_large_image', title, description, images: ['/eason/covers/u87.webp'] },
}

export default function EasonPage() {
  return <VinylRoom />
}
