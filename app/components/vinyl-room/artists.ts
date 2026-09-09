import albums from '../../modules/music-artists/albums.json' with { type: 'json' };
import type { VinylAlbum } from './types';

export type MusicArtist = {
  id: string;
  name: string;
  english: string;
  albums: VinylAlbum[];
  cover: string;
  sticker?: string;
  description: string;
};

// Add an artist here: the collection, navigation, routes, sitemap and lyrics share this list.
export const musicArtists: MusicArtist[] = [
  { id: 'eason', name: '陈奕迅', english: 'EASON CHAN', albums: albums.eason,
    cover: '/eason/covers/u87.webp', sticker: '/vinyl-room/stickers/eason-balloons.svg',
    description: '滚动翻阅陈奕迅的专辑，点击唱片查看歌曲，选择歌词，收藏那些后来才听懂的声音。' },
  { id: 'mayday', name: '五月天', english: 'MAYDAY', albums: albums.mayday,
    cover: '/mayday/covers/gods-children.webp', sticker: '/vinyl-room/stickers/mayday-carrot.svg',
    description: '翻阅五月天的录音室专辑、演唱会、合辑与 EP，展开歌曲，重温青春。' },
  { id: 'gem', name: '邓紫棋', english: 'G.E.M.', albums: albums.gem,
    cover: '/gem/covers/city-zoo.webp',
    description: '翻阅邓紫棋的专辑、演唱会与 EP，收藏旋律里的勇气与心声。' },
  { id: 'the-weeknd', name: 'The Weeknd', english: 'THE WEEKND', albums: albums['the-weeknd'],
    cover: '/the-weeknd/covers/after-hours.webp',
    description: '翻阅 The Weeknd 的专辑、混音带、演唱会与 EP，走进旋律里的深夜电台。' },
  { id: 'kanye-west', name: 'Kanye West', english: 'KANYE WEST', albums: albums['kanye-west'],
    cover: '/kanye-west/covers/graduation.webp',
    description: '翻阅 Kanye West 的个人与合作专辑，重听采样、节拍与声音实验。' },
  { id: 'post-malone', name: 'Post Malone', english: 'POST MALONE', albums: albums['post-malone'],
    cover: '/post-malone/covers/hollywoods-bleeding.webp',
    description: '翻阅 Post Malone 的专辑与合辑，收藏那些带着沙哑嗓音的旋律。' },
  { id: 'charlie-puth', name: 'Charlie Puth', english: 'CHARLIE PUTH', albums: albums['charlie-puth'],
    cover: '/charlie-puth/covers/voicenotes.webp',
    description: '翻阅 Charlie Puth 的专辑与 EP，重听钢琴、和声与流行旋律。' },
  { id: 'justin-bieber', name: 'Justin Bieber', english: 'JUSTIN BIEBER', albums: albums['justin-bieber'],
    cover: '/justin-bieber/covers/purpose.webp',
    description: '翻阅 Justin Bieber 的专辑、演唱会与 EP，收藏从少年到成长的声音。' },
  { id: 'taylor-swift', name: 'Taylor Swift', english: 'TAYLOR SWIFT', albums: albums['taylor-swift'],
    cover: '/taylor-swift/covers/1989.webp',
    description: '翻阅 Taylor Swift 的专辑、重录作品、演唱会与 EP，在旋律与叙事里收藏自己的片段。' },
  { id: 'jay-chou', name: '周杰伦', english: 'JAY CHOU', albums: albums['jay-chou'],
    cover: '/jay-chou/covers/common-jasmine-orange.webp',
    description: '翻阅周杰伦的专辑、演唱会、电影原声与 EP，重听青春里的旋律与故事。' },
];

export const findMusicArtist = (id: string | null) => musicArtists.find(artist => artist.id === id);
