'use client';

import { useEffect, useLayoutEffect, useRef, useState, type PointerEvent } from 'react';
import { ArrowDown, ArrowLeft, ArrowUp, ArrowUpRight, Disc3, Mouse, X } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import styles from './index.module.css';
import type { VinylAlbum } from './types';
import { createVinylScene } from './vinyl-scene';
import { durationLabel } from './record-math';
import type { VinylTrack } from './share/types';
import ArtistAtmosphere, { type ArtistRoomTheme } from './artist-atmosphere';
import RoomNavigation from './room-navigation';

const ShareWorkshop = dynamic(() => import('./share/workshop'), { ssr: false });

export default function VinylRoom({ albums, artist, artistEnglish, edition, theme, minimalDetail = false }: {
  albums: VinylAlbum[];
  artist: string;
  artistEnglish: string;
  edition: string;
  theme: ArtistRoomTheme;
  minimalDetail?: boolean;
}) {
  const initialIndex = Math.min(4, albums.length - 1);
  const [current, setCurrent] = useState(initialIndex);
  const [opened, setOpened] = useState<number | null>(null);
  const [ready, setReady] = useState(false);
  const [graphicsError, setGraphicsError] = useState(false);
  const [sharing, setSharing] = useState<VinylTrack | null>(null);
  const [shareReady, setShareReady] = useState(false);
  const [composing, setComposing] = useState(false);
  const roomRoot = useRef<HTMLElement>(null);
  const selectedTrackButton = useRef<HTMLButtonElement | null>(null);
  const selectedSharedAlbum = useRef(false);
  const canvas = useRef<HTMLCanvasElement>(null);
  const controls = useRef<ReturnType<typeof createVinylScene> | null>(null);
  const detailPanel = useRef<HTMLElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const openButton = useRef<HTMLButtonElement>(null);
  const hadDetails = useRef(false);
  const album = albums[opened ?? current];
  const detail = opened !== null;

  useEffect(() => {
    if (!canvas.current) return;
    try {
      const scene = createVinylScene(canvas.current, albums,
        setCurrent,
        setOpened,
        () => setReady(true));
      controls.current = scene;
      return () => { controls.current = null; scene.destroy(); };
    } catch (error) {
      console.error('Unable to initialize the vinyl renderer', error);
      setGraphicsError(true);
    }
  }, [albums]);

  useEffect(() => {
    if (detail) { (minimalDetail ? detailPanel.current : closeButton.current)?.focus({ preventScroll: true }); hadDetails.current = true; }
    else if (hadDetails.current) openButton.current?.focus({ preventScroll: true });
  }, [detail, minimalDetail]);

  useEffect(() => {
    // Load the editor while browsing songs so its code does not delay a click.
    if (detail) void import('./share/workshop');
  }, [detail]);

  useLayoutEffect(() => {
    if (!sharing) return;
    let active = true;
    // Fetch immediately, but wait for the song list's actual exit before revealing lyrics.
    const exits = detailPanel.current?.getAnimations().filter(animation =>
      animation instanceof CSSTransition && animation.transitionProperty === 'opacity') || [];
    if (!exits.length) setShareReady(true);
    else void Promise.allSettled(exits.map(animation => animation.finished)).then(() => {
      if (active) setShareReady(true);
    });
    return () => { active = false; };
  }, [sharing]);

  useEffect(() => {
    if ((!ready && !graphicsError) || selectedSharedAlbum.current) return;
    selectedSharedAlbum.current = true;
    const trackId = Number(new URLSearchParams(window.location.search).get('track'));
    const index = albums.findIndex(item => item.tracks.some(track => track.trackId === trackId));
    if (index < 0) return;
    // Existing QR links identify a song; let visitors start from its album on the shelf.
    if (graphicsError) setCurrent(index); else controls.current?.select(index);
  }, [ready, graphicsError, albums]);

  function closeShare() {
    setSharing(null); setShareReady(false); setComposing(false);
    requestAnimationFrame(() => (selectedTrackButton.current || detailPanel.current)?.focus({ preventScroll: true }));
  }

  function open(index: number) {
    if (graphicsError) { setOpened(index); return; }
    controls.current?.open(index);
  }
  function close() {
    if (sharing) { closeShare(); return; }
    if (graphicsError) setOpened(null);
    else controls.current?.close();
  }
  function handleDetailPointerMove(event: PointerEvent<HTMLElement>) {
    if (!detail || composing || event.pointerType !== 'mouse' || !detailPanel.current) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const panel = detailPanel.current.getBoundingClientRect();
    const compact = rect.width < 760 || (rect.width <= 950 && rect.height <= 500);
    // Include all of the gap between the CD and the song panel.
    const width = compact ? rect.width : panel.left - rect.left;
    const height = compact ? panel.top - rect.top : rect.height;
    const x = (event.clientX - rect.left) / width;
    const y = (event.clientY - rect.top) / height;
    const inside = x >= 0 && x <= 1 && y >= 0 && y <= 1;
    controls.current?.tilt(inside ? x * 2 - 1 : 0, inside ? y * 2 - 1 : 0);
  }

  return (
    <section ref={roomRoot} tabIndex={-1} lang="zh-CN" data-room-theme={theme} aria-label={`${artist}黑胶室`} aria-busy={!ready && !graphicsError} className={[styles['vinyl-room'], detail ? styles['detail-open'] : '', detail && minimalDetail ? styles['minimal-detail'] : '', sharing ? styles.sharing : '', composing ? styles.composing : ''].join(' ')} onPointerDownCapture={event => { event.currentTarget.dataset.instant = 'false'; }} onKeyDownCapture={event => { event.currentTarget.dataset.instant = 'true'; }} onPointerMoveCapture={handleDetailPointerMove} onPointerLeave={() => controls.current?.tilt(0, 0)} onKeyDown={event => { if (detail && event.key === 'Escape') { event.stopPropagation(); close(); } }}>
      <ArtistAtmosphere theme={theme} subdued={detail} />
      <h1 className={styles['visually-hidden']}>{artist}黑胶室</h1>
      <header className={styles['masthead']}>
        {detail && minimalDetail && !sharing && <button className={styles['mobile-back']} onClick={close}><ArrowLeft size={18} />返回唱片架</button>}
        {!minimalDetail && <Link href="/#music" className={styles['wordmark']} aria-label="返回 HaoCorner 首页音乐区"><Disc3 size={29} strokeWidth={1.2} /><span>黑胶室<small>THE VINYL ROOM</small></span></Link>}
        {!detail && <RoomNavigation room={theme} artist={artist} artistEnglish={artistEnglish} />}
        {detail ? !minimalDetail && <button className={styles['close-detail']} ref={closeButton} onClick={close}><span>返回唱片架</span><X size={20} /></button> : <span className={styles['edition']}>VOL. {edition} <span>—</span> {albums.length} RECORDS</span>}
      </header>

      <div className={styles['share-backdrop']} style={{ backgroundImage: `linear-gradient(var(--room-share-top), var(--room-share-bottom)), url(${album.background})` }} aria-hidden="true" />
      <canvas ref={canvas} className={styles['vinyl-canvas']} aria-label={`${artist} 3D 唱片架，滚动或拖动翻阅；点击专辑查看歌曲`} />

      {!detail && <>
        <div className={styles['collection-label']} aria-hidden="true"><span>THE COLLECTION</span><span>{albums[0].year} — {albums[albums.length - 1].year}</span></div>
        <div className={styles['selection-marker']} aria-hidden="true"><span /><span /></div>
        <nav className={styles['album-index']} aria-label="选择专辑">{albums.map((record, index) => <button key={record.id} onClick={() => open(index)} aria-label={`打开 ${record.title} 的歌曲列表`} aria-current={current === index ? 'true' : undefined} title={`${record.year} · ${record.title}`}><span /></button>)}</nav>
        <div className={styles['browse-footer']}>
          <button className={styles['current-album']} ref={openButton} onClick={() => open(current)} aria-label={`打开 ${album.title} 的歌曲列表`}>
            <span className={styles['current-kicker']}>{album.year}<span> / </span>{String(current + 1).padStart(2, '0')} — {albums.length}</span>
            <span className={styles['current-title']}>{album.title}<ArrowUpRight size={20} strokeWidth={1.2} /></span>
          </button>
          <p className={styles['browse-hint']}><Mouse size={19} strokeWidth={1.2} /><span className={styles['desktop-hint']}>滚动翻阅 · 点击展开歌曲</span><span className={styles['touch-hint']}>上下滑动 · 轻触查看歌曲</span></p>
          <div className={styles['arrow-controls']}><button onClick={() => controls.current?.step(-1)} aria-label="上一张专辑"><ArrowUp size={19} /></button><button onClick={() => controls.current?.step(1)} aria-label="下一张专辑"><ArrowDown size={19} /></button></div>
        </div>
      </>}

      {detail && <>
        {minimalDetail && !sharing && <button className={styles['detail-dismiss']} onClick={close} aria-label="关闭专辑详情，返回唱片架" />}
        {/* Keep clicks on the CD, including its transparent rim, off the backdrop. */}
        <div className={styles['detail-cover']} />
        {graphicsError && <img className={minimalDetail ? styles['detail-cover'] : styles['fallback-detail-cover']} src={album.artwork} alt={`${album.title} 封面`} />}
        <div className={styles['detail-caption']}><span>{String(opened + 1).padStart(2, '0')} / {albums.length}</span>{!minimalDetail && <a href={album.sourceUrl} target="_blank" rel="noreferrer">CoverBox <ArrowUpRight size={13} /></a>}</div>
        <section ref={detailPanel} tabIndex={-1} className={styles['track-panel']} aria-label={`${album.title} 的歌曲`} {...(sharing ? { 'aria-hidden': true, inert: true } : {})}>
          {minimalDetail && <button ref={closeButton} className={styles['album-back']} onClick={close}><ArrowLeft size={16} />返回唱片架</button>}
          <div className={styles['album-heading']}><p className={styles['eyebrow']}>{album.year}<span>·</span>{album.songCount} 首歌曲</p><h2>{album.title}</h2><p className={styles['album-artist']}>{album.artist}</p></div>
          <div className={styles['track-scroll']}>
            {album.unreturnedItemCount > 0 && <p className={styles['availability-note']}>当前地区可读取 {album.songCount} 首，另 {album.unreturnedItemCount} 首暂未提供；保留原曲序。</p>}
            {album.musicNote && <p className={styles['availability-note']}>{album.musicNote}</p>}
            <p className={styles['share-hint']}>点击歌曲，选择歌词并生成分享图。</p>
            <ol className={styles['track-list']}>{album.tracks.map(track => <li key={track.trackId} className={styles['song-row']}><button className={styles['song-select']} onClick={event => { selectedTrackButton.current = event.currentTarget; roomRoot.current?.focus({ preventScroll: true }); controls.current?.tilt(0, 0); setShareReady(false); setSharing(track); }} aria-label={`选择 ${track.trackName} 的歌词`}><span className={styles['track-number']}>{String(track.trackNumber).padStart(2, '0')}</span><span className={styles['track-name']}>{track.trackName}</span><span className={styles['track-duration']}>{durationLabel(track.trackTimeMillis)}</span></button>{track.musicUrl && <a className={styles['song-listen']} href={track.musicUrl} target="_blank" rel="noreferrer" aria-label={`在 Apple Music 打开 ${track.trackName}`} title="在 Apple Music 听歌"><ArrowUpRight size={15} /></a>}</li>)}</ol>
          </div>
          {!minimalDetail && <>
          <div className={styles['album-footer']}><span>{Math.round(album.totalSongTimeMillis / 60000)} 分钟{album.unreturnedItemCount > 0 ? ' · 已读取曲目' : ''}</span><a href={album.musicUrl} target="_blank" rel="noreferrer">Apple Music 中国区 <ArrowUpRight size={15} /></a></div>
          <p className={styles['copyright']}>{album.copyright}</p>
          </>}
        </section>
      </>}

      {sharing && detail && <ShareWorkshop key={sharing.trackId} entered={shareReady} album={album} track={sharing} room={theme} onClose={closeShare} onStageChange={setComposing} />}

      {!ready && !graphicsError && <output className={styles['loading-note']}>正在摆放唱片…</output>}
      {graphicsError && !detail && <div className={styles['graphics-fallback']}><p>当前浏览器未能启用 3D，仍可选择专辑查看歌曲。</p><div>{albums.map((record,index)=><button key={record.id} onClick={()=>open(index)}><img src={record.artwork} alt={record.title} /><span>{record.title}</span></button>)}</div></div>}
    </section>
  );
}
