import type { Metadata } from 'next'
import VinylRoom from '../components/vinyl-room'
import albums from '../modules/mayday-page/albums.json'

const title = '黑胶室 · Mayday on record'
const description = '从《五月天第一张创作专辑》到《自传》，滚动翻阅五月天的九张专辑，展开歌曲，在 Apple Music 重温青春。'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/mayday' },
  openGraph: {
    title,
    description,
    url: '/mayday',
    locale: 'zh_CN',
    type: 'website',
    images: [{ url: '/mayday/covers/gods-children.webp', width: 764, height: 839, alt: '五月天 神的孩子都在跳舞 专辑封面' }],
  },
  twitter: { card: 'summary_large_image', title, description, images: ['/mayday/covers/gods-children.webp'] },
}

export default function MaydayPage() {
  return <VinylRoom key="mayday" theme="mayday" albums={albums} artist="五月天" artistEnglish="MAYDAY" edition="002" minimalDetail />
}
