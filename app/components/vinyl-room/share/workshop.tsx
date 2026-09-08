'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Download, Grid2X2, ImageIcon, RotateCcw, Share2 } from 'lucide-react';
import type { VinylAlbum } from '../types';
import { durationLabel } from '../record-math';
import { download, exportPosters, renderPoster } from './poster';
import { draftKey, emptyDraft, MAX_NOTE, MAX_QUOTE, readDraft, type Draft, type LyricCandidate, type ShareFile, type VinylTrack } from './types';
import styles from './workshop.module.css';

type Stage = 'lyrics' | 'edit' | 'export';
const inactive = (value: boolean) => value ? { 'aria-hidden': true as const, inert: true } : {};

export default function ShareWorkshop({ album, track, room, entered, onClose, onStageChange }: {
  album: VinylAlbum; track: VinylTrack; room: string; entered: boolean; onClose: () => void; onStageChange: (composing: boolean) => void;
}) {
  const [stage, setStage] = useState<Stage>('lyrics');
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [hydrated, setHydrated] = useState(false);
  const [manual, setManual] = useState(false);
  const [candidates, setCandidates] = useState<LyricCandidate[]>([]);
  const [chosen, setChosen] = useState<LyricCandidate | null>(null);
  const [selected, setSelected] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(0);
  const [loadError, setLoadError] = useState('');
  const [message, setMessage] = useState('');
  const [storageError, setStorageError] = useState(false);
  const [preview, setPreview] = useState('');
  const [previewError, setPreviewError] = useState('');
  const [gaps, setGaps] = useState(false);
  const [files, setFiles] = useState<ShareFile[]>([]);
  const [busy, setBusy] = useState(false);
  const [canShare, setCanShare] = useState(false);
  const [activeFile, setActiveFile] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const previewElement = useRef<HTMLDivElement>(null);
  const lyricList = useRef<HTMLOListElement>(null);
  const lyricAnimations = useRef<Animation[]>([]);
  const generated = useRef<ShareFile[]>([]);
  const alive = useRef(true);
  const lines = chosen?.lyrics.split(/\r?\n/).map(line => line.trim()).filter(Boolean) || [];
  const update = (patch: Partial<Draft>) => { setDraft(value => ({ ...value, ...patch })); setMessage(''); };

  useEffect(() => {
    alive.current = true;
    const saved = readDraft(track.trackId); setDraft(saved); setManual(Boolean(saved.quote)); setHydrated(true);
    return () => { alive.current = false; generated.current.forEach(file => URL.revokeObjectURL(file.url)); };
  }, [track.trackId]);

  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem(draftKey(track.trackId), JSON.stringify(draft)); setStorageError(false); }
    catch { setStorageError(true); }
  }, [draft, hydrated, track.trackId]);

  useEffect(() => {
    const abort = new AbortController(); setLoading(true); setLoadError('');
    fetch(`/api/lyrics?room=${room}&track=${track.trackId}`, { signal: abort.signal })
      .then(async response => { const data = await response.json(); if (!response.ok) throw new Error(data.error); return data; })
      .then(data => {
        if (abort.signal.aborted) return;
        setCandidates(data.candidates); setChosen(data.candidates.find((item: LyricCandidate) => item.exact) || null);
        if (!data.candidates.length) { setLoadError('暂未找到这首歌的歌词，粘贴喜欢的几句也可以。'); setManual(true); }
      })
      .catch(error => { if (!abort.signal.aborted) { setLoadError(error.message || '歌词加载失败，请重试。'); setManual(true); } })
      .finally(() => { if (!abort.signal.aborted) setLoading(false); });
    return () => abort.abort();
  }, [track.trackId, room, attempt]);

  useEffect(() => {
    if (!entered) return;
    onStageChange(stage !== 'lyrics'); heading.current?.focus({ preventScroll: true });
    if (root.current && matchMedia('(max-width: 759px), (max-width: 950px) and (max-height: 500px)').matches) {
      root.current.scrollTop = stage === 'export' ? Math.max(0, (panel.current?.offsetTop || 0) - 82) : 0;
    }
  }, [stage, entered, onStageChange]);

  useLayoutEffect(() => {
    const list = lyricList.current;
    if (!list || !entered || loading || manual || root.current?.closest('[data-instant="true"]') || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // Only stagger visible rows, keeping the rest ready for scrolling.
    // Selection updates do not restart the reveal; changing versions does.
    const scrollport = list.parentElement!.getBoundingClientRect();
    const rows = Array.from(list.children).filter(row => {
      const bounds = row.getBoundingClientRect();
      return bounds.top < scrollport.bottom && bounds.bottom > scrollport.top;
    });
    const stagger = Math.max(30, Math.min(45, 330 / Math.max(1, rows.length - 1)));
    lyricAnimations.current = rows.map((row, index) => row.animate([
      { opacity: 0, transform: 'translateY(8px)' },
      { opacity: 1, transform: 'translateY(0)' },
    ], { duration: 230, delay: index * stagger, easing: 'cubic-bezier(.23,1,.32,1)', fill: 'backwards' }));
    return () => { lyricAnimations.current.forEach(animation => animation.cancel()); lyricAnimations.current = []; };
  }, [chosen, entered, loading, manual]);

  useEffect(() => {
    if (stage === 'lyrics' || !draft.quote.trim()) return;
    let cancelled = false;
    renderPoster(album, track, draft, room).then(canvas => {
      if (cancelled) return;
      setPreview(canvas.toDataURL('image/png')); setPreviewError('');
    }).catch(error => { if (!cancelled) setPreviewError(error.message); });
    return () => { cancelled = true; };
  }, [album, track, draft, room, stage]);

  // Format switches are interruptible. Text input and keyboard actions remain immediate.
  useEffect(() => {
    const element = previewElement.current;
    if (!element || root.current?.dataset.instant === 'true' || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    element.getAnimations().forEach(animation => animation.cancel());
    element.animate([{ opacity: .45, transform: 'translateY(6px) scale(.985)' }, { opacity: 1, transform: 'translateY(0) scale(1)' }],
      { duration: 220, easing: 'cubic-bezier(.23,1,.32,1)' });
  }, [draft.format, draft.style]);

  function selectLine(index: number) {
    const next = selected.includes(index) ? selected.filter(value => value !== index) : [...selected, index].sort((a, b) => a - b);
    const quote = next.map(value => lines[value]).join('\n');
    if (next.length > 6 || quote.length > MAX_QUOTE) { setMessage('一张图最多选 6 句、140 字，让文字保持好读。'); return; }
    setSelected(next); update({ quote });
  }

  function back() {
    if (busy) return;
    if (stage === 'export') { setStage('edit'); setMessage(''); }
    else if (stage === 'edit') setStage('lyrics');
    else onClose();
  }

  async function generate() {
    if (busy || !draft.quote.trim()) return;
    setBusy(true); setMessage('');
    try {
      const next = await exportPosters(album, track, draft, room);
      if (!alive.current) { next.forEach(file => URL.revokeObjectURL(file.url)); return; }
      generated.current.forEach(file => URL.revokeObjectURL(file.url)); generated.current = next;
      setFiles(next); setActiveFile(0); setStage('export');
      const nativeFiles = next.map(file => new File([file.blob], file.name, { type: 'image/png' }));
      setCanShare(Boolean(navigator.canShare?.({ files: nativeFiles })));
    } catch (error) { if (alive.current) setMessage(error instanceof Error ? error.message : '生成失败，请重试。'); }
    finally { if (alive.current) setBusy(false); }
  }

  async function saveAll() {
    if (files.length === 1) { download(files[0].blob, files[0].name); setMessage('已开始下载；手机上也可以长按下方图片保存。'); return; }
    setBusy(true);
    try {
      const { zipSync, strToU8 } = await import('fflate');
      const entries: Record<string, Uint8Array> = { '保存顺序.txt': strToU8('按 01–09 顺序选择图片：从左到右，从上到下。\n打开微信朋友圈，选择这九张图片即可拼成整张海报。\nHaoCorner · https://yanchenhao.com') };
      for (const file of files) entries[file.name] = new Uint8Array(await file.blob.arrayBuffer());
      download(new Blob([new Uint8Array(zipSync(entries, { level: 0 }))], { type: 'application/zip' }), `HaoCorner-${track.trackId}-九宫格.zip`);
      setMessage('已开始下载九宫格 ZIP，解压后按 01–09 顺序选图。');
    } catch { setMessage('打包失败，仍可逐张保存下方图片。'); }
    finally { setBusy(false); }
  }

  async function nativeShare() {
    try {
      await navigator.share({ files: files.map(file => new File([file.blob], file.name, { type: 'image/png' })) });
      setMessage('已交给系统分享面板。');
    } catch (error) { if (!(error instanceof Error && error.name === 'AbortError')) setMessage('系统未能分享这些图片，可以下载后在微信中选择。'); }
  }

  return <div ref={root} className={styles.workshop} data-stage={stage} data-format={draft.format} data-entered={entered} {...inactive(!entered)}
    onPointerDownCapture={() => { if (root.current) root.current.dataset.instant = 'false'; }}
    onKeyDownCapture={() => { if (root.current) root.current.dataset.instant = 'true'; lyricAnimations.current.forEach(animation => animation.cancel()); }}
    onKeyDown={event => { if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); back(); } }}>
    <div className={styles.topbar}><button onClick={back} disabled={busy}><ArrowLeft size={16} />{stage === 'lyrics' ? '返回歌曲' : stage === 'edit' ? '重新选句' : '继续编辑'}</button><span>LYRIC SHARE <i>/</i> {stage === 'lyrics' ? '01' : stage === 'edit' ? '02' : '03'}</span></div>

    <div className={styles.previewSide} {...inactive(stage === 'lyrics')}>
      <div className={styles.previewCaption}><span>分享图预览</span><span>{draft.format === 'grid' ? 'NINE IMAGES' : 'SINGLE IMAGE'}</span></div>
      <div ref={previewElement} className={styles.preview} data-gaps={gaps && draft.format === 'grid'} aria-label="分享图实时预览">
        {preview && (draft.format === 'grid' ? <><div className={styles.tiles}>{Array.from({ length: 9 }, (_, index) => <div key={index} style={{ backgroundImage: `url(${preview})`, backgroundPosition: `${index % 3 * 50}% ${Math.floor(index / 3) * 50}%`, transform: gaps ? `translate(${(index % 3 - 1) * 5}px, ${(Math.floor(index / 3) - 1) * 5}px)` : 'translate(0,0)' }} />)}</div><img className={styles.wholePoster} style={{ opacity: gaps ? 0 : 1 }} src={preview} alt={`${track.trackName}九宫格完整海报`} /></> : <img src={preview} alt={`${track.trackName}歌词分享图`} />)}
        {!preview && <span className={styles.previewLoading}>正在生成预览…</span>}
      </div>
      <div className={styles.previewTools}>{draft.format === 'grid' ? <button aria-pressed={gaps} onClick={() => setGaps(value => !value)}><Grid2X2 size={14} />{gaps ? '查看完整海报' : '预览朋友圈间距'}</button> : <span>1080 × 1080 · 高清图片</span>}<span>{draft.format === 'grid' ? '整图 3240 × 3240' : 'PNG 格式'}</span></div>
      {previewError && <p role="alert" className={styles.error}>{previewError}</p>}
    </div>

    <div ref={panel} className={styles.panel}>
      <div className={styles.panelHeading}><p className={styles.eyebrow}>{album.title} <span>·</span> {album.year}</p><h2 ref={heading} tabIndex={-1}>{stage === 'lyrics' ? track.trackName : stage === 'edit' ? '编辑分享图' : '保存分享图'}</h2><p className={styles.subtitle}>{stage === 'lyrics' ? `${album.artist} · ${durationLabel(track.trackTimeMillis)}` : stage === 'edit' ? '选择样式，添加感悟和署名（选填）。' : files.length === 9 ? '从左到右、从上到下，按 01–09 顺序选图。' : '图片已生成，可下载保存。'}</p></div>
      <div className={styles.stageStack}>
        <section className={styles.stage} data-active={stage === 'lyrics'} {...inactive(stage !== 'lyrics')} aria-label="选择歌词">
          <div className={styles.lyricToolbar}><span>{manual ? '粘贴你想分享的片段' : '轻点选句 · 最多 6 句'}</span><button onClick={() => {
            if (manual && chosen) setSelected([]);
            setManual(value => !value);
          }}>{manual ? '查看在线歌词' : '粘贴歌词'}</button></div>
          <div className={styles.lyricScroll} onScroll={() => lyricAnimations.current.forEach(animation => animation.cancel())}>
            {manual ? <><label className={styles.srOnly} htmlFor="custom-lyrics">歌词片段</label><textarea id="custom-lyrics" className={styles.manualLyrics} rows={7} placeholder="粘贴要分享的歌词，支持换行。" maxLength={MAX_QUOTE} value={draft.quote} onChange={event => update({ quote: event.target.value })} /><p className={styles.fieldHint}>{draft.quote.length} / {MAX_QUOTE} 字 · 保留你输入的换行</p></> : <>
              {loading && <p role="status" className={styles.serviceNote}>正在加载歌词…</p>}
              {!loading && !chosen && candidates.length > 0 && <div className={styles.candidates}><p>找到这些版本，请确认专辑和时长。</p>{candidates.map(item => <button key={item.id} onClick={() => { setChosen(item); setSelected([]); update({ quote: '' }); }}><span>{item.title}<small>{item.album}</small></span><span>{durationLabel(item.duration * 1000)}<ArrowRight size={14} /></span></button>)}</div>}
              {entered && !loading && chosen && <ol ref={lyricList} key={chosen.id} className={styles.lyricLines}>{lines.map((line, index) => <li key={index}><button aria-pressed={selected.includes(index)} onClick={() => selectLine(index)}><span>{line}</span><span className={styles.lineCheck}>{selected.includes(index) ? <Check size={15} /> : '+'}</span></button></li>)}</ol>}
            </>}
            {loadError && <p className={styles.serviceNote}>{loadError} <button onClick={() => setAttempt(value => value + 1)}>重试</button></p>}
            {track.musicUrl && <a className={`${styles.listen} ${styles.mobileListen}`} href={track.musicUrl} target="_blank" rel="noreferrer">在 Apple Music 听这首歌 <ArrowUpRight size={12} /></a>}
          </div>
          {!loading && chosen && !manual && <p className={styles.source}>歌词来自 <a href={`https://lrclib.net/api/get/${chosen.id}`} target="_blank" rel="noreferrer">LRCLIB <ArrowUpRight size={10} /></a> · {chosen.album}<button onClick={() => { setChosen(null); setSelected([]); update({ quote: '' }); }}>更换版本</button></p>}
          <div className={styles.stageFooter}><p className={styles.selectionCount}>{draft.quote.trim() ? `已选 ${draft.quote.length} 字` : '请先选择歌词'}</p><button className={styles.primary} disabled={!draft.quote.trim()} onClick={() => { setStage('edit'); setMessage(''); }}>下一步 <ArrowRight size={16} /></button></div>
          {track.musicUrl && <a className={`${styles.listen} ${styles.desktopListen}`} href={track.musicUrl} target="_blank" rel="noreferrer">在 Apple Music 听这首歌 <ArrowUpRight size={12} /></a>}
        </section>

        <section className={styles.stage} data-active={stage === 'edit'} {...inactive(stage !== 'edit')} aria-label="编辑分享图">
          <div className={styles.editScroll}>
            <div className={styles.segment} role="group" aria-label="分享形式"><span style={{ transform: draft.format === 'grid' ? 'translateX(100%)' : 'translateX(0)' }} />{(['single', 'grid'] as const).map(format => <button key={format} aria-pressed={draft.format === format} onClick={() => update({ format })}>{format === 'single' ? <ImageIcon size={15} /> : <Grid2X2 size={15} />}{format === 'single' ? '单张图片' : '九宫格海报'}</button>)}</div>
            {draft.format === 'single' ? <div className={styles.stylePicker} role="group" aria-label="单图样式"><button aria-pressed={draft.style === 'color'} onClick={() => update({ style: 'color' })}><i />纯色背景</button><button aria-pressed={draft.style === 'ambient'} onClick={() => update({ style: 'ambient' })}><i />渐变背景</button></div> : <p className={styles.formatNote}>专辑封面铺满画面，歌词和感悟显示在底部。</p>}
            <blockquote className={styles.selectedQuote}>{draft.quote}<button onClick={() => setStage('lyrics')} aria-label="重新选择歌词"><RotateCcw size={13} /></button></blockquote>
            <label className={styles.fieldLabel} htmlFor="share-note">感悟 <span>选填</span></label><textarea id="share-note" rows={3} maxLength={MAX_NOTE} placeholder="输入感悟，可留空" value={draft.note} onChange={event => update({ note: event.target.value })} /><p className={styles.fieldHint}>{draft.note.length} / {MAX_NOTE}</p>
            <div className={styles.fieldRow}><div><label className={styles.fieldLabel} htmlFor="share-signature">署名 <span>选填</span></label><input id="share-signature" maxLength={24} placeholder="输入名字或日期" value={draft.signature} onChange={event => update({ signature: event.target.value })} /></div></div>
          </div>
          <div className={styles.stageFooter}><p className={styles.draftNote}>{storageError ? '浏览器未能保存草稿，请暂时保留页面。' : '草稿已自动保存'}<span>扫码查看专辑</span></p><button className={styles.primary} disabled={busy || Boolean(previewError)} onClick={generate}>{busy ? '正在生成…' : '生成分享图'} <ArrowRight size={16} /></button></div>
        </section>

        <section className={styles.stage} data-active={stage === 'export'} {...inactive(stage !== 'export')} aria-label="导出分享图">
          <div className={styles.exportScroll}>
            <div className={styles.exportActions}><button className={styles.primary} disabled={busy} onClick={saveAll}><Download size={16} />{busy ? '正在打包…' : files.length === 9 ? '下载九宫格 ZIP' : '下载高清图片'}</button>{canShare && <button className={styles.secondary} onClick={nativeShare}><Share2 size={16} />系统分享</button>}</div>
            <p className={styles.saveHelp}>保存后打开微信朋友圈，选择图片发布。手机也可以长按下方图片保存。</p>
            {files.length === 9 && <div className={styles.fileGrid} aria-label="九宫格保存顺序">{files.map((file, index) => <button key={file.name} aria-pressed={activeFile === index} aria-label={`查看第 ${index + 1} 张图片`} onClick={() => setActiveFile(index)}><img src={file.url} alt={`第 ${index + 1} 张`} /><span>{String(index + 1).padStart(2, '0')}</span></button>)}</div>}
            {files[activeFile] && <div className={styles.saveImage}><div><span>{files.length === 9 ? `第 ${String(activeFile + 1).padStart(2, '0')} / 09 张` : '高清原图'}</span><button onClick={() => download(files[activeFile].blob, files[activeFile].name)}>保存这张 <Download size={13} /></button></div><img src={files[activeFile].url} alt={`长按保存：${track.trackName}分享图 ${activeFile + 1}`} /></div>}
          </div>
          <p className={styles.privateNote}>感悟仅保存在你的设备和导出的图片里。</p>
        </section>
      </div>
      <p className={styles.message} role="status" aria-live="polite">{message}</p>
    </div>
  </div>;
}
