'use client';

import { useEffect, useLayoutEffect, useRef, useState, type PointerEvent } from 'react';
import { ArrowDown, ArrowLeft, ArrowUp, ArrowUpRight, Disc3, X } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import styles from './index.module.css';
import { findMusicArtist, musicArtists } from './artists';
import Collection from './collection';
import RecordLoading from './record-loading';
import { createVinylScene } from './vinyl-scene';
import { durationLabel } from './record-math';
import type { VinylTrack } from './share/types';
import ArtistAtmosphere, { type ArtistRoomTheme } from './artist-atmosphere';
import RoomNavigation from './room-navigation';
import { useMusicLanguage } from './locale';
import { artistDisplayName, messageKey } from './messages';

const ShareWorkshop = dynamic(() => import('./share/workshop'), { ssr: false });

export default function VinylRoom() {
  const { locale, t } = useMusicLanguage();
  const pathname = usePathname();
  const requestedArtist = findMusicArtist(pathname.slice(1));
  const isCollection = !requestedArtist;
  const lastArtist = useRef(requestedArtist || musicArtists[0]);
  const initialRoom = useRef(requestedArtist?.id ?? null);
  const profile = requestedArtist || lastArtist.current;
  const { albums, name: artist, english: artistEnglish, id: theme } = profile;
  const edition = String(musicArtists.indexOf(profile) + 1).padStart(3, '0');
  const minimalDetail = true;
  const [transitioning, setTransitioning] = useState(false);
  const changedRoute = useRef(false);
  const previousPath = useRef(pathname);
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
  const album = albums[Math.min(opened ?? current, albums.length - 1)];
  const showRoom = !isCollection && !transitioning;
  const detail = opened !== null;

  useEffect(() => {
    const title = `${isCollection ? t('唱片收藏室') : t('{artist}黑胶室', { artist: artistDisplayName(profile, locale) })} | Yanchenhao's Corner`;
    // Next can stream route metadata after hydration. Keep the chosen UI language
    // when that happens without reloading the route or rebuilding the 3D scene.
    const syncTitle = () => { if (document.title !== title) document.title = title; };
    syncTitle();
    const observer = new MutationObserver(syncTitle);
    observer.observe(document.head, { childList: true, subtree: true, characterData: true });
    controls.current?.refreshCollection();
    return () => observer.disconnect();
  }, [locale, pathname, t, profile, isCollection]);

  useEffect(() => {
    if (!canvas.current) return;
    try {
      const scene = createVinylScene(canvas.current, musicArtists, initialRoom.current,
        setCurrent,
        setOpened,
        () => setReady(true), setTransitioning);
      controls.current = scene;
      return () => { controls.current = null; scene.destroy(); };
    } catch (error) {
      console.error('Unable to initialize the vinyl renderer', error);
      setGraphicsError(true);
    }
  }, []);

  useLayoutEffect(() => {
    if (requestedArtist) lastArtist.current = requestedArtist;
    setOpened(null); setSharing(null); setShareReady(false); setComposing(false);
    selectedSharedAlbum.current = false;
    if (controls.current) controls.current.navigate(requestedArtist?.id ?? null, roomRoot.current?.dataset.instant === 'true');
    if (graphicsError) setCurrent(Math.min(4, albums.length - 1));
    changedRoute.current = previousPath.current !== pathname;
    previousPath.current = pathname;
  }, [pathname, graphicsError]);

  useEffect(() => {
    if (transitioning || !ready || !changedRoute.current) return;
    const frame = requestAnimationFrame(() => {
      const selectedBox = roomRoot.current?.querySelector<HTMLElement>('[data-collection-scroll]')?.dataset.selectedBox;
      const target = isCollection ? roomRoot.current?.querySelector<HTMLElement>(selectedBox ? `[data-walk-box="${selectedBox}"]` : `a[href="/${lastArtist.current.id}"]`) : roomRoot.current;
      if (!target || target.closest('[inert]')) return;
      target.focus({ preventScroll: true });
      changedRoute.current = false;
    });
    return () => cancelAnimationFrame(frame);
  }, [transitioning, ready, isCollection]);

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
    if (isCollection || transitioning || (!ready && !graphicsError) || selectedSharedAlbum.current) return;
    selectedSharedAlbum.current = true;
    const trackId = Number(new URLSearchParams(window.location.search).get('track'));
    const index = albums.findIndex(item => item.tracks.some(track => track.trackId === trackId));
    if (index < 0) return;
    // Existing QR links identify a song; let visitors start from its album on the shelf.
    if (graphicsError) setCurrent(index); else controls.current?.select(index);
  }, [ready, graphicsError, albums, transitioning, isCollection]);

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
    <section ref={roomRoot} tabIndex={-1} lang={locale === 'zh' ? 'zh-CN' : 'en'} data-room-theme={theme} data-collection={isCollection} data-transitioning={transitioning} aria-label={isCollection ? t("唱片收藏室") : t('{artist}黑胶室', { artist: artistDisplayName(profile, locale) })} aria-busy={(!ready && !graphicsError) || transitioning} className={[styles['vinyl-room'], detail ? styles['detail-open'] : '', detail && minimalDetail ? styles['minimal-detail'] : '', sharing ? styles.sharing : '', composing ? styles.composing : ''].join(' ')} onPointerDownCapture={event => { event.currentTarget.dataset.instant = 'false'; }} onKeyDownCapture={event => { event.currentTarget.dataset.instant = 'true'; }} onPointerMoveCapture={handleDetailPointerMove} onPointerLeave={() => controls.current?.tilt(0, 0)} onKeyDown={event => { if (detail && event.key === 'Escape') { event.stopPropagation(); close(); } }}>
      <div className={styles['room-atmosphere']}><ArtistAtmosphere theme={theme} /></div>
      {!isCollection && <h1 className={styles['visually-hidden']}>{t('{artist}黑胶室', { artist: artistDisplayName(profile, locale) })}</h1>}
      {showRoom && <header className={styles['masthead']}>
        {detail && minimalDetail && !sharing && <button className={styles['mobile-back']} onClick={close}><ArrowLeft size={18} />{t("返回唱片架")}</button>}
        {!minimalDetail && <Link href="/#music" className={styles['wordmark']} aria-label={t("返回 HaoCorner 首页音乐区")}><Disc3 size={29} strokeWidth={1.2} /><span>{t("黑胶室")}<small>THE VINYL ROOM</small></span></Link>}
        {!detail && <RoomNavigation room={theme} artist={artist} artistEnglish={artistEnglish} />}
        {detail ? !minimalDetail && <button className={styles['close-detail']} ref={closeButton} onClick={close}><span>{t("返回唱片架")}</span><X size={20} /></button> : <span className={styles['edition']}>VOL. {edition} <span>—</span> {albums.length} RECORDS</span>}
      </header>}

      <div className={styles['share-backdrop']} style={{ backgroundImage: `linear-gradient(var(--room-share-top), var(--room-share-bottom)), url(${album.background})` }} aria-hidden="true" />
      <canvas ref={canvas} className={styles['vinyl-canvas']} aria-label={isCollection ? t("歌手的半开纸箱和 CD 收藏") : t('{artist} 3D 唱片架，滚动或拖动翻阅；点击专辑查看歌曲', { artist: artistDisplayName(profile, locale) })} />

      <Collection visible={isCollection && !transitioning} fallback={graphicsError} onScroll={() => controls.current?.refreshCollection()} onHover={id => controls.current?.hoverBox(id)} onChoose={entryId => controls.current?.chooseCollectionBox(entryId)} />

      {showRoom && !detail && <>
        <Link className={styles['back-collection']} href="/music" scroll={false}><ArrowLeft size={15} />{t("唱片收藏室")}</Link>
        <div className={styles['collection-label']} aria-hidden="true"><span>THE COLLECTION</span><span>{albums[0].year} — {albums[albums.length - 1].year}</span></div>
        <div className={styles['selection-marker']} aria-hidden="true"><span /><span /></div>
        <nav className={styles['album-index']} aria-label={t("选择专辑")}>{albums.map((record, index) => <button key={record.id} onClick={() => open(index)} aria-label={t('打开 {album} 的歌曲列表', { album: record.title })} aria-current={current === index ? 'true' : undefined} title={`${record.year} · ${record.title}`}><span /></button>)}</nav>
        <div className={styles['browse-footer']}>
          <button className={styles['current-album']} ref={openButton} onClick={() => open(current)} aria-label={t('打开 {album} 的歌曲列表', { album: album.title })}>
            <span className={styles['current-kicker']}>{album.year}<span> / </span>{String(current + 1).padStart(2, '0')} — {albums.length}</span>
            <span className={styles['current-title']}>{album.title}<ArrowUpRight size={20} strokeWidth={1.2} /></span>
          </button>
          <div className={styles['arrow-controls']}><button onClick={() => controls.current?.step(-1)} aria-label={t("上一张专辑")}><ArrowUp size={19} /></button><button onClick={() => controls.current?.step(1)} aria-label={t("下一张专辑")}><ArrowDown size={19} /></button></div>
        </div>
      </>}

      {showRoom && detail && <>
        {minimalDetail && !sharing && <button className={styles['detail-dismiss']} onClick={close} aria-label={t("关闭专辑详情，返回唱片架")} />}
        {/* Keep clicks on the CD, including its transparent rim, off the backdrop. */}
        <div className={styles['detail-cover']} />
        {graphicsError && <img className={minimalDetail ? styles['detail-cover'] : styles['fallback-detail-cover']} src={album.artwork} alt={t('{album} 封面', { album: album.title })} />}
        <div className={styles['detail-caption']}><span>{String(opened + 1).padStart(2, '0')} / {albums.length}</span>{!minimalDetail && <a href={album.sourceUrl} target="_blank" rel="noreferrer">{t("专辑来源")} <ArrowUpRight size={13} /></a>}</div>
        <section ref={detailPanel} tabIndex={-1} className={styles['track-panel']} aria-label={t('{album} 的歌曲', { album: album.title })} {...(sharing ? { 'aria-hidden': true, inert: true } : {})}>
          {minimalDetail && <button ref={closeButton} className={styles['album-back']} onClick={close}><ArrowLeft size={16} />{t("返回唱片架")}</button>}
          <div className={styles['album-heading']}><p className={styles['eyebrow']}>{album.year}<span>·</span>{t('{count} 首歌曲', { count: album.songCount })}</p><h2>{album.title}</h2><p className={styles['album-artist']}>{album.artist}</p></div>
          <div className={styles['track-scroll']}>
            {album.unreturnedItemCount > 0 && <p className={styles['availability-note']}>{t('当前目录已读取 {count} 首歌曲，另 {missing} 项暂未提供；保留原曲序。', { count: album.songCount, missing: album.unreturnedItemCount })}</p>}
            {album.musicNote && <p className={styles['availability-note']}>{t(messageKey(album.musicNote, '当前目录暂未提供歌曲直链。'))}</p>}
            <p className={styles['share-hint']}>{t("点击歌曲，选择歌词并生成分享图。")}</p>
            <ol className={styles['track-list']}>{album.tracks.map(track => <li key={track.trackId} className={styles['song-row']}><button className={styles['song-select']} onClick={event => { selectedTrackButton.current = event.currentTarget; roomRoot.current?.focus({ preventScroll: true }); controls.current?.tilt(0, 0); setShareReady(false); setSharing(track); }} aria-label={t('选择 {track} 的歌词', { track: track.trackName })}><span className={styles['track-number']}>{String(track.trackNumber).padStart(2, '0')}</span><span className={styles['track-name']}>{track.trackName}</span><span className={styles['track-duration']}>{durationLabel(track.trackTimeMillis)}</span></button>{track.musicUrl && <a className={styles['song-listen']} href={track.musicUrl} target="_blank" rel="noreferrer" aria-label={t('在 Apple Music 打开 {track}', { track: track.trackName })} title={t("在 Apple Music 听歌")}><ArrowUpRight size={15} /></a>}</li>)}</ol>
          </div>
          {!minimalDetail && <>
          <div className={styles['album-footer']}><span>{t('{count} 分钟', { count: Math.round(album.totalSongTimeMillis / 60000) })}{album.unreturnedItemCount > 0 ? ` · ${t('已读取曲目')}` : ''}</span><a href={album.musicUrl} target="_blank" rel="noreferrer">{t("专辑页面")} <ArrowUpRight size={15} /></a></div>
          <p className={styles['copyright']}>{album.copyright}</p>
          </>}
        </section>
      </>}

      {showRoom && sharing && detail && <ShareWorkshop key={sharing.trackId} entered={shareReady} album={album} track={sharing} room={theme} onClose={closeShare} onStageChange={setComposing} />}

      <RecordLoading active={!ready && !graphicsError} />
      {showRoom && graphicsError && !detail && <div className={styles['graphics-fallback']}><p>{t("当前浏览器未能启用 3D，仍可选择专辑查看歌曲。")}</p><div>{albums.map((record,index)=><button key={record.id} onClick={()=>open(index)}><img src={record.artwork} alt={record.title} /><span>{record.title}</span></button>)}</div></div>}
    </section>
  );
}
