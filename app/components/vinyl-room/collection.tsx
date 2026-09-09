import Link from 'next/link';
import { ArrowDown, ArrowLeft, ArrowUpRight } from 'lucide-react';
import { musicArtists } from './artists';
import { collectionWalkEntries } from './collection-walk-layout';
import styles from './collection.module.css';

export default function Collection({ visible, fallback, onScroll, onHover, onChoose }: {
  visible: boolean; fallback: boolean; onScroll: () => void; onHover: (id: string | null) => void; onChoose: (entryId: string) => void;
}) {
  const entries = collectionWalkEntries(musicArtists.map(artist => artist.id));
  return <div className={styles.collection} data-collection-scroll data-visible={visible} {...(!visible ? { 'aria-hidden': true, inert: true } : {})} onScroll={onScroll}>
    <div className={styles.trail} data-walk-trail><div className={styles.walkStage}>
    <header className={styles.header}>
      <Link href="/#music"><ArrowLeft size={15} />Me</Link>
    </header>
    <h1 className={styles.title}>唱片收藏室</h1>
    <div className={styles.boxes}>
      {entries.map((entry, index) => { const artist = musicArtists.find(artist => artist.id === entry.artistId)!; return <Link key={entry.id} href={`/${artist.id}`} scroll={false}
        data-walk-box={entry.id} data-walk-row={entry.row} data-walk-primary={index < musicArtists.length}
        className={styles.artist} aria-label={`打开 ${artist.name} 的收藏箱，${artist.albums.length} 张专辑`}
        onClick={() => onChoose(entry.id)}
        onPointerEnter={event => { if (event.pointerType === 'mouse') onHover(artist.id); }} onPointerLeave={() => onHover(null)}
        onFocus={event => { onHover(artist.id); if (event.currentTarget.dataset.near !== 'true' && event.currentTarget.matches(':focus-visible')) event.currentTarget.dispatchEvent(new CustomEvent('focus-collection-box', { bubbles: true, detail: entry.id })); }} onBlur={() => onHover(null)}>
        <div className={styles.boxArt} data-music-box={artist.id} aria-hidden="true">
          <canvas className={styles.boxSnapshot} />
          {fallback && <div className={styles.fallbackBox}><img src={artist.cover} alt="" /><span>{artist.english}</span>{artist.sticker && <img src={artist.sticker} className={styles.fallbackSticker} alt="" />}</div>}
        </div>
        <div className={styles.caption}>
          <span className={styles.number}>BOX {String(index + 1).padStart(2, '0')}</span>
          <div><h2>{artist.name}<ArrowUpRight size={23} strokeWidth={1.3} /></h2><p>{artist.english}</p></div>
          <span className={styles.count}>{artist.albums.length} 张专辑<small>{artist.albums[0].year} — {artist.albums.at(-1)!.year}</small></span>
        </div>
      </Link>; })}
    </div>
    <div className={styles.walkHint}><span><ArrowDown size={13} />向前滚动</span><span><b data-walk-position>01</b> / <span data-walk-total>{String(entries.length / 2).padStart(2, '0')}</span></span></div>
    </div></div>
  </div>;
}
