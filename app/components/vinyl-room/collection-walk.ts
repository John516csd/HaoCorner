import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { MusicArtist } from './artists';
import type { createCollectionBox } from './collection-box';
import { collectionSlot, collectionEase } from './record-math';
import { collectionWalkArrival, collectionWalkEntries, collectionWalkPose, collectionWalkStops, WALK_SPACING } from './collection-walk-layout';

export function createCollectionWalk(canvas: HTMLCanvasElement, artists: MusicArtist[],
  boxes: ReturnType<typeof createCollectionBox>[], getRecords: (index: number) => THREE.Group[],
  savedPosition: (index: number) => number, start: () => void) {
  gsap.registerPlugin(ScrollTrigger);
  const scroller = canvas.parentElement!.querySelector<HTMLElement>('[data-collection-scroll]')!;
  const trail = scroller.querySelector<HTMLElement>('[data-walk-trail]')!;
  const counter = scroller.querySelector<HTMLElement>('[data-walk-position]')!;
  const total = scroller.querySelector<HTMLElement>('[data-walk-total]')!;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const group = new THREE.Group();
  let width = 1, height = 1, enabled = false, progress = 0, target = 0, picked = 0;
  let trigger: ScrollTrigger | null = null;
  const cdRotation = new THREE.Quaternion().setFromEuler(new THREE.Euler(.06, Math.PI / 2 - .14, 0));

  // Reuse textures and geometry. Each instance only owns materials so distant boxes can fade independently.
  const entries = collectionWalkEntries(artists.map(artist => artist.id)).map(entry => {
    const source = boxes[entry.artistIndex];
    source.flaps.forEach(({ pivot, axis, sign, rest }) => { pivot.rotation[axis] = sign * rest; });
    const copies = new Map<THREE.Material, { material: THREE.Material; opacity: number; transparent: boolean }>();
    function copyMaterial(material: THREE.Material) {
      if (!copies.has(material)) copies.set(material, { material: material.clone(), opacity: material.opacity, transparent: material.transparent });
      return copies.get(material)!.material;
    }
    function copyObject<T extends THREE.Object3D>(original: T) {
      const copy = original.clone();
      copy.traverse(object => {
        const drawable = object as THREE.Mesh;
        if (drawable.material) drawable.material = Array.isArray(drawable.material) ? drawable.material.map(copyMaterial) : copyMaterial(drawable.material);
      });
      return copy;
    }
    const carton = copyObject(source.group);
    const sleeves = getRecords(entry.artistIndex).map(original => {
      const sleeve = new THREE.Group();
      // At this distance the body, artwork and spine suffice; skip transparent case and rim passes.
      [0, 1, 2, original.children.length - 1].forEach(index => sleeve.add(copyObject(original.children[index])));
      carton.add(sleeve);
      return sleeve;
    });
    group.add(carton);
    const link = scroller.querySelector<HTMLAnchorElement>(`[data-walk-box="${entry.id}"]`)!;
    return { ...entry, carton, sleeves, copies, link, art: link.querySelector<HTMLElement>('[data-music-box]')!, caption: link.lastElementChild as HTMLElement };
  });
  const rows = entries.length / 2;

  function resize(nextWidth: number, nextHeight: number) {
    width = nextWidth; height = nextHeight;
    const nextEnabled = !reduced.matches;
    if (nextEnabled) {
      const stops = collectionWalkStops(width, rows);
      trail.style.height = `${100 + (stops - 1) * 120}dvh`;
      total.textContent = String(stops).padStart(2, '0');
    }
    if (nextEnabled !== enabled) {
      enabled = nextEnabled;
      scroller.dataset.walking = String(enabled);
      if (enabled) {
        trigger = ScrollTrigger.create({ scroller, trigger: trail, start: 'top top',
          end: () => `+=${Math.max(1, trail.offsetHeight - scroller.clientHeight)}`,
          onUpdate: self => { target = self.progress; start(); },
        });
      } else {
        trigger?.kill(); trigger = null;
        trail.style.removeProperty('height');
        entries.forEach(entry => {
          entry.link.removeAttribute('style'); entry.link.inert = false;
          entry.art.removeAttribute('style'); entry.caption.removeAttribute('style');
        });
        scroller.scrollTop = 0;
      }
    }
    trigger?.refresh();
    start();
  }

  function update(dt: number, unpack: number, browsing: boolean) {
    group.visible = enabled && unpack < .35;
    if (!enabled) return false;
    if (browsing && unpack === 0) {
      const instant = canvas.parentElement?.dataset.instant === 'true';
      progress += (target - progress) * (instant ? 1 : 1 - Math.exp(-dt / 65));
      if (Math.abs(target - progress) < .00005) progress = target;
    }
    counter.textContent = String(Math.round(progress * (collectionWalkStops(width, rows) - 1)) + 1).padStart(2, '0');
    if (!group.visible) return false;
    entries.forEach((entry, index) => {
      const pose = collectionWalkPose(entry.row, entry.column, progress, width, height, rows);
      const { x, y, z, scale, pitch, distance, artWidth, artHeight, perspective, screenX, screenY } = pose;
      const visible = pose.visible && screenY < height + artHeight * perspective && screenX > -artWidth * perspective && screenX < width + artWidth * perspective;
      entry.carton.visible = visible && !(index === picked && unpack > 0);
      entry.carton.position.set(x, y, z);
      entry.carton.rotation.set(pitch, pose.yaw, pose.roll);
      entry.carton.scale.setScalar(scale);
      const count = entry.sleeves.length;
      entry.sleeves.forEach((sleeve, i) => {
        const slot = collectionSlot(i, savedPosition(entry.artistIndex), count);
        sleeve.position.set((slot - (count - 1) / 2) * (boxes[entry.artistIndex].width - .24) / count, .18, 0);
        sleeve.quaternion.copy(cdRotation); sleeve.scale.setScalar(.85);
      });
      const fade = (1 - collectionEase(unpack / .35)) * (1 - .7 * collectionEase((distance / WALK_SPACING - 1.4) / 1.8));
      entry.copies.forEach((copy, original) => {
        const from = original as THREE.MeshBasicMaterial, to = copy.material as THREE.MeshBasicMaterial;
        if ('map' in from && to.map !== from.map) { to.map = from.map; to.needsUpdate = true; }
        copy.material.opacity = copy.opacity * fade;
        copy.material.transparent = copy.transparent || fade < 1;
      });
      entry.link.style.width = `${artWidth}px`;
      entry.link.style.transform = `translate3d(${screenX - artWidth * perspective / 2}px, ${screenY - artHeight * perspective / 2}px, 0) scale(${perspective})`;
      entry.link.style.zIndex = String(100 - Math.round(distance / 100));
      entry.link.style.visibility = visible ? 'visible' : 'hidden';
      entry.link.inert = !visible;
      entry.art.style.height = `${artHeight}px`;
      entry.caption.style.opacity = String(Math.max(0, 1 - Math.max(0, distance - 120) / 560));
      entry.link.dataset.near = String(Math.abs(distance) < 500);
    });
    return browsing && progress !== target;
  }

  function focusEntry(event: Event) {
    if (!enabled) return;
    const entry = entries.find(entry => entry.id === (event as CustomEvent<string>).detail);
    if (!entry) return;
    scroller.scrollTop = collectionWalkArrival(entry.row, entry.column, width, rows) * (scroller.scrollHeight - scroller.clientHeight);
    trigger?.update(); progress = target;
    start();
  }
  scroller.addEventListener('focus-collection-box', focusEntry);
  const changeMotion = () => resize(width, height);
  reduced.addEventListener('change', changeMotion);

  return { group, resize, update,
    get enabled() { return enabled; },
    pose(index: number) { return collectionWalkPose(entries[picked].row, entries[picked].artistIndex === index ? entries[picked].column : index % 2, progress, width, height, rows); },
    choose(id: string) { const index = entries.findIndex(entry => entry.id === id); if (index >= 0) { picked = index; scroller.dataset.selectedBox = id; } },
    destroy() {
      trigger?.kill(); scroller.removeEventListener('focus-collection-box', focusEntry); reduced.removeEventListener('change', changeMotion);
      delete scroller.dataset.walking;
      delete scroller.dataset.selectedBox;
      trail.style.removeProperty('height');
      entries.forEach(entry => entry.copies.forEach(copy => copy.material.dispose()));
      group.removeFromParent();
    },
  };
}
