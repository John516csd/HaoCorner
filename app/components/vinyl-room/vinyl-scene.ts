import * as THREE from 'three';
import type { VinylAlbum } from './types';
import { loopIndex, nearestPosition, releaseVelocity, coast } from './record-math';

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
  // CDs stay about 1,000–2,100 units away; preserve depth precision between the cover and its backing.
  const camera = new THREE.PerspectiveCamera(45, 1, 100, 6000);
  camera.position.z = 1300;
  const anisotropy = Math.min(16, renderer.capabilities.getMaxAnisotropy());
  const plane = new THREE.PlaneGeometry(1, 1);
  const body = new THREE.BoxGeometry(1, 1, .044);
  const edge = new THREE.PlaneGeometry(1.018, .052);
  const caseGeometry = new THREE.BoxGeometry(1.018, 1.018, .052);
  const caseEdges = new THREE.EdgesGeometry(caseGeometry);
  scene.add(new THREE.HemisphereLight('#f1f5fa', '#293331', 2));
  const keyLight = new THREE.DirectionalLight('#ffffff', 2.5);
  keyLight.position.set(-600, 900, 1100); scene.add(keyLight);
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
  let velocity = 0, lastInput = 0, inertia = false;
  let pointerId: number | null = null, moved = false, startY = 0, startTarget = 0;
  const wheelQuietTime = 60;
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)');
  let hovered: number | null = null, keyboardFocus: number | null = null;
  const tiltTarget = new THREE.Vector2(), tiltCurrent = new THREE.Vector2();
  const pointer = new THREE.Vector2();
  const raycaster = new THREE.Raycaster();

  function textureSetup(texture: THREE.Texture) {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = anisotropy;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    textures.push(texture);
    return texture;
  }

  const reflection = document.createElement('canvas');
  reflection.width = reflection.height = 512;
  const reflectionContext = reflection.getContext('2d')!;
  const sheen = reflectionContext.createLinearGradient(0, 512, 512, 0);
  sheen.addColorStop(0, '#ffffff00'); sheen.addColorStop(.38, '#ffffff00');
  sheen.addColorStop(.48, '#ffffff24'); sheen.addColorStop(.52, '#ffffff05');
  sheen.addColorStop(.85, '#ffffff00'); sheen.addColorStop(1, '#ffffff12');
  reflectionContext.fillStyle = sheen; reflectionContext.fillRect(0, 0, 512, 512);
  reflectionContext.strokeStyle = '#eff8ff8c'; reflectionContext.lineWidth = 2;
  reflectionContext.strokeRect(3, 3, 506, 506);
  reflectionContext.strokeStyle = '#0b171a66'; reflectionContext.strokeRect(8, 8, 496, 496);
  // Molded hinge grooves stay at the edge, clear of the cover artwork.
  for (let x = 11; x < 25; x += 3) {
    reflectionContext.fillStyle = x % 2 ? '#edfbff45' : '#0b171a55';
    reflectionContext.fillRect(x, 12, 1, 488);
  }
  const reflectionTexture = textureSetup(new THREE.CanvasTexture(reflection));

  const records = albums.map((album, index) => {
    const group = new THREE.Group();
    group.userData.index = index; group.userData.lift = 0;
    const sideMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color(album.color).lerp(new THREE.Color('#242c2d'), .2) });
    const coverMaterial = new THREE.MeshBasicMaterial({ color: '#ffffff' });
    materials.push(sideMaterial, coverMaterial);
    group.add(new THREE.Mesh(body, sideMaterial));
    const front = new THREE.Mesh(plane, coverMaterial);
    front.position.z = .0225; front.scale.setScalar(.985);
    group.add(front);
    const back = new THREE.Mesh(plane, coverMaterial);
    back.rotation.x = Math.PI;
    back.position.z = -.0225; back.scale.setScalar(.985);
    group.add(back);
    const plastic = new THREE.MeshPhongMaterial({ color: '#c7d8df', specular: '#ffffff', shininess: 140, transparent: true, opacity: .08, depthWrite: false });
    const rimMaterial = new THREE.LineBasicMaterial({ color: '#dcecf2', transparent: true, opacity: .32 });
    const reflectionMaterial = new THREE.MeshBasicMaterial({ map: reflectionTexture, transparent: true, opacity: .55, depthWrite: false });
    materials.push(plastic, rimMaterial, reflectionMaterial);
    group.add(new THREE.Mesh(caseGeometry, plastic));
    const rim = new THREE.LineSegments(caseEdges, rimMaterial);
    rim.raycast = () => {}; group.add(rim);
    const lid = new THREE.Mesh(plane, reflectionMaterial);
    lid.scale.setScalar(1.016); lid.position.z = .0265;
    lid.raycast = () => {}; group.add(lid);
    group.userData.reflection = reflectionMaterial;
    group.userData.rim = rimMaterial;

    const label = document.createElement('canvas');
    label.width = 2048; label.height = 104;
    const ctx = label.getContext('2d')!;
    const plasticEdge = ctx.createLinearGradient(0, 0, 0, 104);
    plasticEdge.addColorStop(0, '#e4eff1'); plasticEdge.addColorStop(.08, '#819497');
    plasticEdge.addColorStop(.2, '#334346'); plasticEdge.addColorStop(.78, '#39474a');
    plasticEdge.addColorStop(.91, '#a2b3b6'); plasticEdge.addColorStop(1, '#152326');
    ctx.fillStyle = plasticEdge; ctx.fillRect(0, 0, 2048, 104);
    const paperColor = new THREE.Color(album.color).lerp(new THREE.Color('#969992'), .12);
    ctx.fillStyle = paperColor.getStyle(); ctx.fillRect(55, 15, 1938, 74);
    ctx.fillStyle = '#ffffff25'; ctx.fillRect(55, 15, 1938, 2);
    ctx.fillStyle = '#101b2240'; ctx.fillRect(55, 86, 1938, 3);
    for (let x = 12; x < 47; x += 7) {
      ctx.fillStyle = '#e7f3f578'; ctx.fillRect(x, 13, 2, 78); ctx.fillRect(2048 - x - 2, 13, 2, 78);
      ctx.fillStyle = '#0a171b88'; ctx.fillRect(x + 2, 13, 2, 78); ctx.fillRect(2048 - x, 13, 2, 78);
    }
    ctx.fillStyle = album.textColor; ctx.textBaseline = 'middle';
    ctx.globalAlpha = .75; ctx.font = '29px "Helvetica Neue", sans-serif';
    ctx.fillText(String(album.year), 102, 53);
    ctx.globalAlpha = 1;
    ctx.font = album.year <= 2001 || album.id === 'poetry-of-the-day-after'
      ? '500 46px "Songti SC", "Noto Serif CJK SC", serif'
      : '500 43px "Helvetica Neue", "PingFang SC", sans-serif';
    ctx.fillText(album.title, 350, 53, 1280);
    ctx.textAlign = 'right'; ctx.globalAlpha = .75;
    ctx.font = '28px "Helvetica Neue", "PingFang SC", sans-serif';
    ctx.fillText(album.artist, 1944, 53);
    ctx.globalAlpha = 1;
    const labelMaterial = new THREE.MeshBasicMaterial({ map: textureSetup(new THREE.CanvasTexture(label)) });
    materials.push(labelMaterial);
    const spine = new THREE.Mesh(edge, labelMaterial);
    group.userData.label = labelMaterial;
    spine.position.y = .51; spine.rotation.x = -Math.PI / 2;
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
    if (inertia && pointerId === null && now - lastInput >= wheelQuietTime) {
      if (!reducedMotion.matches && Math.abs(velocity) > .00035) {
        const next = coast(velocity, dt);
        target += next.distance; velocity = next.velocity;
      } else {
        velocity = 0; inertia = false; target = Math.round(target);
      }
    }
    const follow = reducedMotion.matches || pointerId !== null ? 1 : 1 - Math.exp(-dt / 48);
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
    if (reducedMotion.matches) { tiltTarget.set(0, 0); tiltCurrent.set(0, 0); }
    tiltCurrent.lerp(tiltTarget, 1 - Math.exp(-dt / 60));
    const tiltMoving = tiltCurrent.distanceTo(tiltTarget) > .0005;
    if (!tiltMoving) tiltCurrent.copy(tiltTarget);
    let hoverMoving = false;
    records.forEach((record, index) => {
      const relative = nearestPosition(position, index, albums.length) - position;
      const baseY = -relative * gap;
      const chosen = index === (opening > 0 || opened !== null ? featured : active);
      const focus = opened === null && !inertia && pointerId === null && index === (hovered ?? keyboardFocus) ? 1 : 0;
      const previousLift = record.userData.lift as number;
      const lift = reducedMotion.matches || keyboardFocus !== null ? focus : previousLift + (focus - previousLift) * (1 - Math.exp(-dt / 45));
      record.userData.lift = Math.abs(lift - focus) < .001 ? focus : lift;
      hoverMoving ||= record.userData.lift !== focus;
      record.userData.reflection.opacity = .55 + lift * .25 + (chosen ? tiltCurrent.length() * .1 * opening : 0);
      record.userData.rim.opacity = .32 + lift * .2;
      record.userData.label.color.setScalar(1 + lift * .1);
      record.visible = Math.abs(relative) < 6 && (chosen || opening < .999);
      record.scale.setScalar(chosen ? size + (detailSize - size) * opening : size);
      if (chosen) {
        record.position.set(detailX * opening, baseY * (1 - opening) + detailY * opening, 0);
        record.rotation.x = Math.PI / 2 * (1 - opening) - tiltCurrent.y * .055 * opening;
        record.rotation.y = tiltCurrent.x * .065 * opening;
        record.position.x += tiltCurrent.x * 5 * opening;
        record.position.y -= tiltCurrent.y * 5 * opening;
      } else {
        const direction = relative <= 0 ? 1 : -1;
        record.position.set(0, baseY + direction * height * opening, -420 * opening);
        record.rotation.set(Math.PI / 2, 0, 0);
      }
      if (!reducedMotion.matches) record.position.z += lift * 32 * (1 - opening);
    });
    renderer.render(scene, camera);
    if (tiltMoving || hoverMoving || inertia || Math.abs(target - position) > .0005 || opening !== goal) frame = requestAnimationFrame(draw);
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
  function tilt(x: number, y: number) {
    if (opened === null || !canHover.matches || reducedMotion.matches || !Number.isFinite(x) || !Number.isFinite(y)) return;
    tiltTarget.set(Math.max(-1, Math.min(1, x)), Math.max(-1, Math.min(1, y))); start();
  }
  function stopMotion() { tiltTarget.set(0, 0); releasePointer(); hovered = keyboardFocus = null; canvas.style.cursor = ''; velocity = 0; inertia = false; lastInput = 0; }
  function close() {
    stopMotion();
    if (opened !== null) { active = opened; onSelect(active); }
    opened = null;
    target = nearestPosition(position, active, albums.length);
    onOpen(null); start();
  }
  function open(index = active) {
    if (!Number.isInteger(index) || index < 0 || index >= albums.length) return;
    stopMotion();
    target = position; tiltCurrent.set(0, 0);
    opened = index; active = index; featured = index;
    onSelect(index); onOpen(index); start();
  }
  function select(index: number) {
    if (!Number.isInteger(index) || index < 0 || index >= albums.length) return;
    if (opened !== null) close();
    stopMotion();
    target = nearestPosition(target, index, albums.length);
    start();
  }
  function step(direction: number) {
    if (opened !== null) return;
    const next = Math.round(inertia ? position : target) + direction;
    stopMotion(); target = next; start();
  }
  function wheel(event: WheelEvent) {
    if (opened !== null || pointerId !== null || event.ctrlKey) return;
    const delta = Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
    const pixels = delta * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? height : 1);
    if (!Number.isFinite(pixels) || pixels === 0) return;
    event.preventDefault();
    hovered = keyboardFocus = null; canvas.style.cursor = '';
    const now = performance.now();
    const elapsed = now - lastInput;
    if (elapsed > 100 || pixels * velocity < 0) { target = position; velocity = 0; }
    const distance = Math.max(-800, Math.min(800, pixels)) / 170;
    // ponytail: wheel has no portable momentum phase; sample the latest deltas so native trackpad tails taper our coast too.
    velocity = reducedMotion.matches ? 0 : releaseVelocity(velocity, distance * .2, Math.min(64, elapsed));
    target += distance;
    lastInput = now; inertia = true; start();
  }
  function down(event: PointerEvent) {
    if (opened !== null || pointerId !== null || event.button !== 0 || !event.isPrimary) return;
    stopMotion(); target = position;
    pointerId = event.pointerId; moved = false;
    startY = event.clientY; startTarget = position; lastInput = performance.now();
    canvas.setPointerCapture(event.pointerId);
  }
  function move(event: PointerEvent) {
    if (pointerId === null) {
      const next = canHover.matches && event.pointerType === 'mouse' && opened === null && !inertia ? recordAt(event) : null;
      if (hovered !== next) { hovered = next; keyboardFocus = null; canvas.style.cursor = next === null ? '' : 'pointer'; start(); }
      return;
    }
    if (event.pointerId !== pointerId) return;
    const delta = startY - event.clientY;
    if (Math.abs(delta) > 5) moved = true;
    if (moved) {
      const now = performance.now();
      const nextTarget = startTarget + delta / gap;
      velocity = reducedMotion.matches ? 0 : releaseVelocity(velocity, nextTarget - target, now - lastInput);
      target = nextTarget; lastInput = now; start();
    }
  }
  function releasePointer() {
    const captured = pointerId; pointerId = null;
    if (captured !== null && canvas.hasPointerCapture(captured)) canvas.releasePointerCapture(captured);
  }
  function up(event: PointerEvent) {
    if (event.pointerId !== pointerId) return;
    releasePointer();
    if (moved) {
      const now = performance.now();
      if (now - lastInput > 80) velocity = 0;
      lastInput = now - wheelQuietTime; inertia = true; start(); return;
    }
    const hit = recordAt(event);
    if (hit !== null) open(hit);
    else { target = Math.round(position); start(); }
  }
  function recordAt(event: PointerEvent) {
    const rect = canvas.getBoundingClientRect();
    pointer.set((event.clientX - rect.left) / width * 2 - 1, -(event.clientY - rect.top) / height * 2 + 1);
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(records, true).find(hit => hit.object.parent?.visible);
    return hit ? hit.object.parent!.userData.index as number : null;
  }
  function leave() { hovered = null; canvas.style.cursor = ''; start(); }
  function cancel(event: PointerEvent) {
    if (event.pointerId !== pointerId) return;
    stopMotion(); target = Math.round(position); start();
  }
  function visibility() {
    if (document.hidden) {
      stopMotion(); target = Math.round(position);
      cancelAnimationFrame(frame); frame = 0; lastTime = 0;
    } else start();
  }
  function key(event: KeyboardEvent) {
    if ((event.target as HTMLElement).closest('input, textarea, select, [contenteditable=true]')) return;
    if (event.key === 'Escape') close();
    if (opened !== null) return;
    if (['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      if (event.key === 'Home') select(0);
      else if (event.key === 'End') select(albums.length - 1);
      else step(event.key === 'ArrowDown' || event.key === 'ArrowRight' ? 1 : -1);
      position = target; keyboardFocus = loopIndex(Math.round(target), albums.length);
    }
  }
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  canvas.addEventListener('wheel', wheel, { passive: false });
  canvas.addEventListener('pointerdown', down);
  canvas.addEventListener('pointermove', move);
  canvas.addEventListener('pointerleave', leave);
  canvas.addEventListener('pointerup', up);
  canvas.addEventListener('pointercancel', cancel);
  canvas.addEventListener('lostpointercapture', cancel);
  document.addEventListener('visibilitychange', visibility);
  window.addEventListener('keydown', key);
  reducedMotion.addEventListener('change', start);
  resize();
  return {
    select, step, open, close, tilt,
    destroy() {
      disposed = true; stopMotion(); cancelAnimationFrame(frame); observer.disconnect();
      canvas.removeEventListener('wheel', wheel);
      canvas.removeEventListener('pointerdown', down);
      canvas.removeEventListener('pointermove', move);
      canvas.removeEventListener('pointerleave', leave);
      canvas.removeEventListener('pointerup', up);
      canvas.removeEventListener('pointercancel', cancel);
      canvas.removeEventListener('lostpointercapture', cancel);
      document.removeEventListener('visibilitychange', visibility);
      window.removeEventListener('keydown', key);
      reducedMotion.removeEventListener('change', start);
      textures.forEach(texture => texture.dispose()); materials.forEach(material => material.dispose());
      plane.dispose(); body.dispose(); edge.dispose(); caseGeometry.dispose(); caseEdges.dispose(); renderer.dispose();
    },
  };
}
