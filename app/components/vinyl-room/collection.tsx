import Link from 'next/link';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { musicArtists } from './artists';
import styles from './collection.module.css';

export default function Collection({ visible, fallback, onScroll, onHover }: {
  visible: boolean; fallback: boolean; onScroll: () => void; onHover: (id: string | null) => void;
}) {
  return <div className={styles.collection} data-visible={visible} {...(!visible ? { 'aria-hidden': true, inert: true } : {})} onScroll={onScroll}>
    <header className={styles.header}>
      <Link href="/#music"><ArrowLeft size={15} />个人主页</Link>
    </header>
    <h1 className={styles.title}>唱片收藏室</h1>
    <div className={styles.boxes}>
      {musicArtists.map((artist, index) => <Link key={artist.id} href={`/${artist.id}`} scroll={false}
        className={styles.artist} aria-label={`打开 ${artist.name} 的收藏箱，${artist.albums.length} 张专辑`}
        onPointerEnter={event => { if (event.pointerType === 'mouse') onHover(artist.id); }} onPointerLeave={() => onHover(null)}
        onFocus={() => onHover(artist.id)} onBlur={() => onHover(null)}>
        <div className={styles.boxArt} data-music-box={artist.id} aria-hidden="true">
          {fallback && <div className={styles.fallbackBox}><img src={artist.cover} alt="" /><span>{artist.english}</span>{artist.sticker && <img src={artist.sticker} className={styles.fallbackSticker} alt="" />}</div>}
        </div>
        <div className={styles.caption}>
          <span className={styles.number}>BOX {String(index + 1).padStart(2, '0')}</span>
          <div><h2>{artist.name}<ArrowUpRight size={23} strokeWidth={1.3} /></h2><p>{artist.english}</p></div>
          <span className={styles.count}>{artist.albums.length} 张专辑<small>{artist.albums[0].year} — {artist.albums.at(-1)!.year}</small></span>
        </div>
      </Link>)}
    </div>

  </div>;
}
