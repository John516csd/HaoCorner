import QRCode from 'qrcode';
import type { VinylAlbum } from '../types';
import type { Draft, ShareFile, VinylTrack } from './types';

const FONT = '"Helvetica Neue", "PingFang SC", "Hiragino Sans GB", sans-serif';
const images = new Map<string, Promise<HTMLImageElement>>();
function loadImage(src: string) {
  if (!images.has(src)) images.set(src, new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => { images.delete(src); reject(new Error('封面未加载完成，请重试。')); };
    image.src = src;
  }));
  return images.get(src)!;
}

function mix(hex: string, target: string, amount: number) {
  const rgb = (value: string) => [1, 3, 5].map(index => parseInt(value.slice(index, index + 2), 16));
  const a = rgb(/^#[0-9a-f]{6}$/i.test(hex) ? hex : '#82a998'), b = rgb(target);
  return `rgb(${a.map((value, index) => Math.round(value * (1 - amount) + b[index] * amount)).join(',')})`;
}

function wrap(ctx: CanvasRenderingContext2D, text: string, width: number) {
  const lines: string[] = [];
  for (const paragraph of text.split('\n')) {
    let line = '';
    // Prefer phrase boundaries before falling back to individual characters.
    for (const token of paragraph.match(/\S+|\s+/gu) || []) {
      if (line && ctx.measureText(line + token).width > width) { lines.push(line.trimEnd()); line = ''; }
      if (!line && !token.trim()) continue;
      // Long unbroken words must also remain inside the export canvas.
      for (const char of Array.from(token)) {
        if (line && ctx.measureText(line + char).width > width) { lines.push(line.trimEnd()); line = ''; }
        line += char;
      }
    }
    lines.push(line.trimEnd());
  }
  return lines;
}

function block(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, width: number, height: number,
  maxSize: number, weight = 400, columns = 1, stride = 0) {
  if (!text) return;
  let size = maxSize, lines: string[] = [], rows = 0;
  do {
    ctx.font = `${weight} ${size}px ${FONT}`;
    lines = wrap(ctx, text, width);
    rows = Math.max(1, Math.floor(height / (size * 1.38)));
    if (lines.length <= rows * columns) break;
    size -= 1;
  } while (size > 8);
  if (lines.length > rows * columns) throw new Error('这段文字的空行太多，请减少空行后再试。');
  lines.forEach((line, index) => ctx.fillText(line, x + Math.floor(index / rows) * stride, y + (index % rows) * size * 1.38));
}

function cover(ctx: CanvasRenderingContext2D, image: HTMLImageElement, x: number, y: number, size: number, radius = 0) {
  ctx.save(); ctx.beginPath(); ctx.roundRect(x, y, size, size, radius); ctx.clip();
  const source = Math.min(image.width, image.height);
  ctx.drawImage(image, (image.width - source) / 2, (image.height - source) / 2, source, source, x, y, size, size);
  ctx.restore();
}

const qrCache = new Map<string, Promise<HTMLImageElement>>();
export async function renderPoster(album: VinylAlbum, track: VinylTrack, draft: Draft, room: string, scale = 1) {
  const link = `https://yanchenhao.com/${room}?track=${track.trackId}`;
  if (!qrCache.has(link)) qrCache.set(link, QRCode.toDataURL(link, { errorCorrectionLevel: 'M', margin: 4, width: 240 }).then(loadImage));
  const [art, qr] = await Promise.all([loadImage(album.artwork), qrCache.get(link)!, document.fonts.ready]);
  const canvas = document.createElement('canvas'); canvas.width = canvas.height = 1080 * scale;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('浏览器暂时无法生成图片，请换一个浏览器重试。');
  ctx.scale(scale, scale); ctx.textBaseline = 'top';
  if (draft.format === 'grid') {
    // Let the original artwork span the entire grid. The first six tiles are
    // artwork only; all added text and the QR sit safely inside the bottom row.
    cover(ctx, art, 0, 0, 1080);
    const shade = ctx.createLinearGradient(0, 640, 0, 1080);
    shade.addColorStop(0, '#09110e00');
    shade.addColorStop(.2, '#09110e14');
    shade.addColorStop(.48, '#09110ed9');
    shade.addColorStop(1, '#09110efa');
    ctx.fillStyle = shade; ctx.fillRect(0, 640, 1080, 440);

    ctx.fillStyle = '#f7f5ee';
    block(ctx, track.trackName, 48, 768, 282, 52, 36, 600);
    ctx.globalAlpha = .7;
    block(ctx, album.artist, 48, 829, 282, 30, 20);
    ctx.globalAlpha = .96;
    block(ctx, draft.quote, 48, 878, 282, 180, 32, 400, draft.note.trim() ? 1 : 2, 360);

    if (draft.note.trim()) {
      ctx.globalAlpha = .9;
      block(ctx, draft.note, 408, 827, 282, 174, 28);
    }
    ctx.globalAlpha = .68;
    // With no personal note, lyrics may flow into the middle tile.
    if (draft.signature) block(ctx, `— ${draft.signature}`, draft.note.trim() ? 408 : 774, 1023, 264, 34, 18);
    ctx.globalAlpha = 1;
    ctx.drawImage(qr, 875, 844, 146, 146);
    ctx.globalAlpha = .5;
    block(ctx, 'yanchenhao.com', 875, 1003, 146, 22, 16);
    ctx.globalAlpha = 1;
  } else {
    const ambient = draft.style === 'ambient';
    ctx.fillStyle = mix(album.color, '#7eaa98', .52); ctx.fillRect(0, 0, 1080, 1080);
    if (ambient) {
      const glow = ctx.createRadialGradient(870, 170, 10, 560, 550, 850);
      glow.addColorStop(0, mix(album.color, '#d9dfbd', .42)); glow.addColorStop(.6, mix(album.color, '#2e4b42', .6)); glow.addColorStop(1, '#152b26');
      ctx.fillStyle = glow; ctx.fillRect(0, 0, 1080, 1080);
      ctx.fillStyle = '#0b1a16cf'; ctx.beginPath(); ctx.roundRect(66, 66, 948, 948, 36); ctx.fill();
    }
    const x = ambient ? 118 : 84, width = ambient ? 844 : 912;
    ctx.fillStyle = ambient ? '#f1f1e6' : '#122b23';
    cover(ctx, art, x, 104, 78, 5);
    block(ctx, track.trackName, x + 103, 108, width - 110, 45, 31, 600);
    ctx.globalAlpha = .7; block(ctx, album.artist, x + 103, 151, width - 110, 35, 25); ctx.globalAlpha = 1;
    block(ctx, draft.quote, x, 265, width, draft.note ? 390 : 550, 98, 750);
    if (draft.note) { ctx.globalAlpha = .75; block(ctx, draft.note, x, 688, width - 15, 158, 28, 400); ctx.globalAlpha = 1; }
    block(ctx, draft.signature ? `— ${draft.signature}` : 'THE VINYL ROOM', x, 909, width - 175, 40, 21, 500);
    ctx.globalAlpha = .55; block(ctx, 'yanchenhao.com', x, 949, width - 175, 28, 18); ctx.globalAlpha = 1;
    ctx.drawImage(qr, 1080 - x - 127, 866, 127, 127);
  }
  return canvas;
}

const toBlob = (canvas: HTMLCanvasElement) => new Promise<Blob>((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('生成图片失败，请重试。')), 'image/png'));

export async function exportPosters(album: VinylAlbum, track: VinylTrack, draft: Draft, room: string): Promise<ShareFile[]> {
  const canvas = await renderPoster(album, track, draft, room, draft.format === 'grid' ? 3 : 1);
  const blobs: Blob[] = [];
  if (draft.format === 'grid') {
    const tile = document.createElement('canvas'); tile.width = tile.height = 1080;
    const ctx = tile.getContext('2d')!;
    for (let index = 0; index < 9; index++) {
      ctx.clearRect(0, 0, 1080, 1080);
      ctx.drawImage(canvas, index % 3 * 1080, Math.floor(index / 3) * 1080, 1080, 1080, 0, 0, 1080, 1080);
      blobs.push(await toBlob(tile));
    }
  } else blobs.push(await toBlob(canvas));
  return blobs.map((blob, index) => ({ blob, url: URL.createObjectURL(blob), name: `HaoCorner-${track.trackId}-${String(index + 1).padStart(2, '0')}.png` }));
}

export function download(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob), anchor = document.createElement('a');
  anchor.href = url; anchor.download = name; document.body.appendChild(anchor); anchor.click(); anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}
