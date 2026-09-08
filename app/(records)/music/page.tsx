import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '唱片收藏室',
  description: '一位歌手，一箱收藏。打开纸箱，翻阅陈奕迅、五月天和更多喜欢的声音。',
  alternates: { canonical: '/music' },
  openGraph: { title: '唱片收藏室', description: '一位歌手，一箱收藏。挑一箱，慢慢翻。', url: '/music', locale: 'zh_CN' },
};

export default function MusicPage() { return null; }
