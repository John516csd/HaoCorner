'use client';

import { useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Check, ChevronDown, House } from 'lucide-react';
import type { ArtistRoomTheme } from './artist-atmosphere';
import styles from './room-navigation.module.css';

const rooms = [
  { id: 'eason', name: '陈奕迅', english: 'EASON CHAN', cover: '/eason/covers/u87.webp' },
  { id: 'mayday', name: '五月天', english: 'MAYDAY', cover: '/mayday/covers/gods-children.webp' },
] as const;

export default function RoomNavigation({ room, artist, artistEnglish }: {
  room: ArtistRoomTheme;
  artist: string;
  artistEnglish: string;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const root = useRef<HTMLElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const pendingFocus = useRef<number | null>(null);

  function close(restoreFocus = false) {
    if (restoreFocus) trigger.current?.focus({ preventScroll: true });
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: globalThis.PointerEvent) {
      if (event.target instanceof Node && !root.current?.contains(event.target)) {
        close(!!root.current?.contains(document.activeElement));
      }
    }
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  useLayoutEffect(() => {
    if (!open || pendingFocus.current === null) return;
    root.current?.querySelectorAll<HTMLAnchorElement>('a')[pendingFocus.current]?.focus();
    pendingFocus.current = null;
  }, [open]);

  function onKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === 'Escape' && open) {
      event.preventDefault();
      event.stopPropagation();
      close(true);
      return;
    }
    // Keep navigation keys out of the record shelf's window-level shortcuts.
    if (['ArrowLeft', 'ArrowRight'].includes(event.key)) event.stopPropagation();
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    event.stopPropagation();
    const links = Array.from(root.current?.querySelectorAll<HTMLAnchorElement>('a') || []);
    const current = links.indexOf(document.activeElement as HTMLAnchorElement);
    let next = 0;
    if (event.key === 'End' || (event.key === 'ArrowUp' && current < 0)) next = links.length - 1;
    else if (event.key === 'ArrowDown') next = (current + 1) % links.length;
    else if (event.key === 'ArrowUp') next = (current - 1 + links.length) % links.length;
    if (open) links[next]?.focus();
    else { pendingFocus.current = next; setOpen(true); }
  }

  return (
    <nav ref={root} className={styles.navigation} aria-label="站点导航" data-open={open}
      onPointerDownCapture={event => { event.currentTarget.dataset.instant = 'false'; }}
      onKeyDownCapture={event => { event.currentTarget.dataset.instant = 'true'; }}
      onKeyDown={onKeyDown}
      onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) close(); }}>
      <button ref={trigger} type="button" className={styles.trigger} aria-expanded={open} aria-controls={panelId}
        aria-label={`${artist} · 切换页面`} onClick={() => setOpen(value => !value)}>
        <span className={styles.english}>{artistEnglish}</span>
        <span className={styles.chinese}>{artist}</span>
        <ChevronDown size={13} strokeWidth={1.5} className={styles.chevron} aria-hidden="true" />
      </button>
      <div id={panelId} className={styles.panel} {...(!open ? { inert: true, 'aria-hidden': true } : {})}>
        <div className={styles.rooms}>
          {rooms.map(item => (
            <Link key={item.id} href={`/${item.id}`} className={styles.room} aria-current={room === item.id ? 'page' : undefined}
              onClick={event => {
                if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                if (room === item.id) { event.preventDefault(); close(true); } else close();
              }}>
              <span className={styles.sleeve}><img src={item.cover} width={40} height={40} alt="" /></span>
              <span className={styles.label}><span>{item.name}</span><small>{item.english}</small></span>
              {room === item.id ? <Check size={15} strokeWidth={1.5} className={styles.current} aria-hidden="true" />
                : <ArrowUpRight size={15} strokeWidth={1.5} className={styles.arrow} aria-hidden="true" />}
            </Link>
          ))}
        </div>
        <Link href="/" className={styles.home} onClick={() => close()}>
          <House size={17} strokeWidth={1.3} aria-hidden="true" />
          <span className={styles.label}><span>个人主页</span><small>yanchenhao.com</small></span>
          <ArrowUpRight size={15} strokeWidth={1.5} className={styles.arrow} aria-hidden="true" />
        </Link>
      </div>
    </nav>
  );
}
