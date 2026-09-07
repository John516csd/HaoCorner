import * as THREE from 'three';
import type { VinylAlbum } from './types';
import { loopIndex, nearestPosition } from './record-math';

export function createVinylScene(
  canvas: HTMLCanvasElement,
  albums: VinylAlbum[],
  onSelect: (index: number) => void,
  onOpen: (index: number | null) => void,
  onReady: () => void,
) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 1, 6000);
  camera.position.z = 1300;
  const anisotropy = Math.min(16, renderer.capabilities.getMaxAnisotropy());
  const plane = new THREE.PlaneGeometry(1, 1);
  const body = new THREE.BoxGeometry(1, 1, .032);
  const edge = new THREE.PlaneGeometry(1, .032);
  const textures: THREE.Texture[] = [];
  const materials: THREE.Material[] = [];
  const loader = new THREE.TextureLoader();
  let disposed = false;
  let frame = 0, lastTime = 0;
  const initialIndex = Math.min(4, albums.length - 1);
  let position = initialIndex, target = initialIndex, active = initialIndex;
  let width = 1, height = 1, size = 500, gap = 90;
  let opened: number | null = null, opening = 0, featured = initialIndex;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let snapTimer: ReturnType<typeof setTimeout>;
  const pointer = new THREE.Vector2();
  const raycaster = new THREE.Raycaster();

  function textureSetup(texture: THREE.Texture) {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = anisotropy;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    textures.push(texture);
    return texture;
  }

  const records = albums.map((album, index) => {
    const group = new THREE.Group();
    group.userData.index = index;
    const sideMaterial = new THREE.MeshBasicMaterial({ color: album.color });
    const coverMaterial = new THREE.MeshBasicMaterial({ color: '#ffffff' });
    materials.push(sideMaterial, coverMaterial);
    group.add(new THREE.Mesh(body, sideMaterial));
    const front = new THREE.Mesh(plane, coverMaterial);
    front.position.z = .0165;
    group.add(front);
    const back = new THREE.Mesh(plane, coverMaterial);
    back.rotation.x = Math.PI;
    back.position.z = -.0165;
    group.add(back);

    const label = document.createElement('canvas');
    label.width = 2048; label.height = 64;
    const ctx = label.getContext('2d')!;
    ctx.fillStyle = album.color; ctx.fillRect(0, 0, label.width, label.height);
    ctx.fillStyle = album.textColor; ctx.textBaseline = 'middle';
    ctx.font = '32px "Helvetica Neue", "PingFang SC", sans-serif';
    ctx.fillText(String(album.year), 38, 33);
    ctx.textAlign = 'center'; ctx.font = '600 43px "Helvetica Neue", "PingFang SC", sans-serif';
    ctx.fillText(album.title, 1010, 33, 1390);
    ctx.textAlign = 'right'; ctx.font = '30px "PingFang SC", sans-serif';
    ctx.fillText(album.artist, 2000, 33);
    const labelMaterial = new THREE.MeshBasicMaterial({ map: textureSetup(new THREE.CanvasTexture(label)) });
    materials.push(labelMaterial);
    const spine = new THREE.Mesh(edge, labelMaterial);
    spine.position.y = .5005; spine.rotation.x = -Math.PI / 2;
    group.add(spine);
    group.rotation.x = Math.PI / 2;
    scene.add(group);
    const cover = loader.load(album.artwork, texture => {
      if (disposed) { texture.dispose(); return; }
      const image = texture.image as HTMLImageElement;
      if (image.width > image.height) { texture.repeat.x = image.height / image.width; texture.offset.x = (1 - texture.repeat.x) / 2; }
      else { texture.repeat.y = image.width / image.height; texture.offset.y = (1 - texture.repeat.y) / 2; }
      coverMaterial.map = texture;
      coverMaterial.needsUpdate = true;
      start();
      if (index === initialIndex) onReady();
    }, undefined, () => { if (!disposed) { start(); onReady(); } });
    textureSetup(cover);
    return group;
  });

  function draw(now: number) {
    frame = 0;
    if (disposed || document.hidden) return;
    const dt = Math.min(now - (lastTime || now - 16.67), 40);
    lastTime = now;
    const follow = reducedMotion.matches ? 1 : 1 - Math.exp(-dt / 72);
    position += (target - position) * follow;
    const goal = opened === null ? 0 : 1;
    opening += (goal - opening) * (reducedMotion.matches ? 1 : 1 - Math.exp(-dt / 125));
    if (Math.abs(opening - goal) < .001) opening = goal;
    const current = loopIndex(Math.round(position), albums.length);
    if (opened === null && opening === 0 && current !== active) { active = current; onSelect(current); }
    const compact = width < 760;
    const detailSize = compact ? Math.min(width * .66, height * .32) : Math.min(width * .35, height * .62, 620);
    const detailX = compact ? 0 : -width * .235;
    const detailY = compact ? height * .5 - 106 - detailSize * .5 : 15;
    records.forEach((record, index) => {
      const relative = nearestPosition(position, index, albums.length) - position;
      const baseY = -relative * gap;
      const chosen = index === (opening > 0 || opened !== null ? featured : active);
      record.visible = Math.abs(relative) < 6 && (chosen || opening < .999);
      record.scale.setScalar(chosen ? size + (detailSize - size) * opening : size);
      if (chosen) {
        record.position.set(detailX * opening, baseY * (1 - opening) + detailY * opening, 0);
        record.rotation.x = Math.PI / 2 * (1 - opening);
      } else {
        const direction = relative <= 0 ? 1 : -1;
        record.position.set(0, baseY + direction * height * opening, -420 * opening);
        record.rotation.x = Math.PI / 2;
      }
    });
    renderer.render(scene, camera);
    if (Math.abs(target - position) > .0005 || opening !== goal) frame = requestAnimationFrame(draw);
    else lastTime = 0;
  }
  function start() { if (!frame && !disposed && !document.hidden) frame = requestAnimationFrame(draw); }
  function resize() {
    width = canvas.clientWidth; height = canvas.clientHeight;
    if (!width || !height) return;
    size = Math.min(width * (width < 760 ? .72 : .47), height * .83, 590);
    gap = height / 9.2;
    camera.aspect = width / height;
    camera.fov = THREE.MathUtils.radToDeg(2 * Math.atan(height / (2 * camera.position.z)));
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    start();
  }
  function close() {
    if (opened !== null) { active = opened; onSelect(active); }
    opened = null;
    target = nearestPosition(position, active, albums.length);
    onOpen(null); start();
  }
  function open(index = active) {
    if (!Number.isInteger(index) || index < 0 || index >= albums.length) return;
    clearTimeout(snapTimer);
    target = position;
    opened = index; active = index; featured = index;
    onSelect(index); onOpen(index); start();
  }
  function select(index: number) {
    if (!Number.isInteger(index) || index < 0 || index >= albums.length) return;
    if (opened !== null) close();
    target = nearestPosition(target, index, albums.length);
    start();
  }
  function step(direction: number) {
    if (opened !== null) return;
    target = Math.round(target) + direction; start();
  }
  function wheel(event: WheelEvent) {
    if (opened !== null || event.ctrlKey) return;
    event.preventDefault();
    const delta = Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
    const pixels = delta * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? height : 1);
    // ponytail: cap a single wheel event; retain its accumulated travel for trackpad momentum.
    target += Math.max(-240, Math.min(240, pixels)) / 170;
    clearTimeout(snapTimer);
    snapTimer = setTimeout(() => { target = Math.round(target); start(); }, 180);
    start();
  }
  let dragging = false, moved = false, startY = 0, startTarget = 0;
  function down(event: PointerEvent) {
    if (opened !== null || event.button !== 0) return;
    clearTimeout(snapTimer); dragging = true; moved = false;
    startY = event.clientY; startTarget = target;
    canvas.setPointerCapture(event.pointerId);
  }
  function move(event: PointerEvent) {
    if (!dragging) return;
    const delta = startY - event.clientY;
    if (Math.abs(delta) > 5) moved = true;
    if (moved) { target = startTarget + delta / gap; start(); }
  }
  function up(event: PointerEvent) {
    if (!dragging) return;
    dragging = false;
    if (moved) { target = Math.round(target); start(); return; }
    const rect = canvas.getBoundingClientRect();
    pointer.set((event.clientX - rect.left) / width * 2 - 1, -(event.clientY - rect.top) / height * 2 + 1);
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(records, true).find(hit => hit.object.parent?.visible);
    if (hit) open(hit.object.parent!.userData.index as number);
  }
  function cancel() { dragging = false; target = Math.round(target); start(); }
  function key(event: KeyboardEvent) {
    if ((event.target as HTMLElement).closest('input, textarea, select, [contenteditable=true]')) return;
    if (event.key === 'Escape') close();
    if (opened !== null) return;
    if (['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      if (event.key === 'Home') select(0);
      else if (event.key === 'End') select(albums.length - 1);
      else step(event.key === 'ArrowDown' || event.key === 'ArrowRight' ? 1 : -1);
    }
  }
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  canvas.addEventListener('wheel', wheel, { passive: false });
  canvas.addEventListener('pointerdown', down);
  canvas.addEventListener('pointermove', move);
  canvas.addEventListener('pointerup', up);
  canvas.addEventListener('pointercancel', cancel);
  document.addEventListener('visibilitychange', start);
  window.addEventListener('keydown', key);
  resize();
  return {
    select, step, open, close,
    destroy() {
      disposed = true; cancelAnimationFrame(frame); clearTimeout(snapTimer); observer.disconnect();
      canvas.removeEventListener('wheel', wheel);
      canvas.removeEventListener('pointerdown', down);
      canvas.removeEventListener('pointermove', move);
      canvas.removeEventListener('pointerup', up);
      canvas.removeEventListener('pointercancel', cancel);
      document.removeEventListener('visibilitychange', start);
      window.removeEventListener('keydown', key);
      textures.forEach(texture => texture.dispose()); materials.forEach(material => material.dispose());
      plane.dispose(); body.dispose(); edge.dispose(); renderer.dispose();
    },
  };
}
