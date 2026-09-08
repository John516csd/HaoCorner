import * as THREE from 'three';
import type { MusicArtist } from './artists';
import { collectionBoxLength } from './record-math';

export function createCollectionBox(artist: MusicArtist, index: number, onLoad: () => void) {
  const group = new THREE.Group();
  let disposed = false;
  const width = collectionBoxLength(artist.albums.length), depth = 1.08, height = .68;
  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];
  const textures: THREE.Texture[] = [];
  const cardboard = document.createElement('canvas');
  cardboard.width = 1024; cardboard.height = 512;
  const ctx = cardboard.getContext('2d')!;
  ctx.fillStyle = '#bd9464'; ctx.fillRect(0, 0, 1024, 512);
  // Fine fibres and shallow creases, baked once into the cardboard.
  for (let i = 0; i < 18000; i++) {
    const x = (i * 167.31) % 1024, y = (i * 71.93) % 512;
    ctx.fillStyle = i % 3 ? '#674a2520' : '#fff1cc38';
    ctx.fillRect(x, y, 1 + i % 4, .6);
  }
  ctx.strokeStyle = '#65462028'; ctx.lineWidth = 2;
  ctx.strokeRect(9, 9, 1006, 494);
  const texture = new THREE.CanvasTexture(cardboard); texture.colorSpace = THREE.SRGBColorSpace; textures.push(texture);
  const paper = new THREE.MeshStandardMaterial({ map: texture, roughness: 1, emissive: '#9a7548', emissiveIntensity: .32, side: THREE.DoubleSide });
  const inside = new THREE.MeshStandardMaterial({ color: '#8f6e45', roughness: 1, side: THREE.DoubleSide });
  const crease = new THREE.LineBasicMaterial({ color: '#795b36', transparent: true, opacity: .45 });
  materials.push(paper, inside, crease);
  function slab(w: number, h: number, d: number, material = paper) {
    const geometry = new THREE.BoxGeometry(w, h, d); geometries.push(geometry);
    const mesh = new THREE.Mesh(geometry, material);
    const edges = new THREE.EdgesGeometry(geometry); geometries.push(edges);
    mesh.add(new THREE.LineSegments(edges, crease));
    return mesh;
  }
  const floor = slab(width, .035, depth, inside); floor.position.y = -height / 2; group.add(floor);
  for (const z of [-depth / 2, depth / 2]) {
    const wall = slab(width, height, .025); wall.position.z = z; group.add(wall);
  }
  for (const x of [-width / 2, width / 2]) {
    const wall = slab(.025, height, depth); wall.position.x = x; group.add(wall);
  }
  const flaps: { pivot: THREE.Group; axis: 'x' | 'z'; sign: number; rest: number }[] = [];
  for (const z of [-1, 1]) {
    const pivot = new THREE.Group(); pivot.position.set(0, height / 2, z * depth / 2);
    const flap = slab(width, .025, depth * .51); flap.position.z = z * depth * .255;
    pivot.add(flap); group.add(pivot); flaps.push({ pivot, axis: 'x', sign: -z, rest: .95 });
  }
  for (const x of [-1, 1]) {
    const pivot = new THREE.Group(); pivot.position.set(x * width / 2, height / 2, 0);
    const flap = slab(depth * .46, .025, depth); flap.position.x = x * depth * .23;
    pivot.add(flap); group.add(pivot); flaps.push({ pivot, axis: 'z', sign: x, rest: .7 });
  }

  const label = document.createElement('canvas'); label.width = 1024; label.height = 512;
  const pen = label.getContext('2d')!;
  pen.drawImage(cardboard, 0, 0);
  pen.save(); pen.translate(110, 100); pen.rotate(-.025);
  pen.fillStyle = '#57402620'; pen.fillRect(3, 6, 660, 260);
  pen.fillStyle = '#e7ddc4'; pen.fillRect(0, 0, 660, 260);
  pen.fillStyle = '#baa37265'; pen.fillRect(240, -15, 170, 30);
  pen.fillStyle = '#807660'; pen.font = '20px sans-serif'; pen.fillText('HAOCORNER / PERSONAL RECORDS', 30, 47);
  pen.fillStyle = '#39342b'; pen.font = '500 51px "Helvetica Neue", sans-serif'; pen.fillText(artist.english, 28, 124, 600);
  pen.font = '28px "PingFang SC", sans-serif'; pen.fillText(artist.name, 30, 182);
  pen.fillStyle = '#8d816c'; pen.font = '19px sans-serif'; pen.fillText(`${artist.albums[0].year} — ${artist.albums.at(-1)!.year}`, 30, 227);
  pen.restore();
  if (!artist.sticker) {
    pen.strokeStyle = '#745243'; pen.lineWidth = 3; pen.strokeRect(827, 192, 125, 113);
    pen.fillStyle = '#745243'; pen.textAlign = 'center'; pen.font = '40px serif'; pen.fillText(String(artist.albums.length), 890, 244);
    pen.font = '20px sans-serif'; pen.fillText('COMPACT DISC', 890, 280, 106);
  }
  pen.textAlign = 'left'; pen.fillStyle = '#6c5338'; pen.font = '20px sans-serif'; pen.fillText(`BOX ${String(index + 1).padStart(2, '0')}     ↑↑     KEEP DRY`, 52, 449);
  const labelTexture = new THREE.CanvasTexture(label); labelTexture.colorSpace = THREE.SRGBColorSpace; textures.push(labelTexture);
  const labelMaterial = new THREE.MeshStandardMaterial({ map: labelTexture, roughness: 1 }); materials.push(labelMaterial);
  const faceGeometry = new THREE.PlaneGeometry(width, height); geometries.push(faceGeometry);
  const face = new THREE.Mesh(faceGeometry, labelMaterial); face.position.z = depth / 2 + .015; group.add(face);

  if (artist.sticker) {
    const stickerTexture = new THREE.TextureLoader().load(artist.sticker, texture => { if (disposed) texture.dispose(); else onLoad(); });
    stickerTexture.colorSpace = THREE.SRGBColorSpace; textures.push(stickerTexture);
    const stickerMaterial = new THREE.MeshBasicMaterial({ map: stickerTexture, transparent: true, depthWrite: false }); materials.push(stickerMaterial);
    const stickerGeometry = new THREE.PlaneGeometry(.464, .58); geometries.push(stickerGeometry);
    const sticker = new THREE.Mesh(stickerGeometry, stickerMaterial);
    sticker.position.set(width / 2 - .29, .015, depth / 2 + .03);
    sticker.rotation.z = index % 2 ? -.12 : .12;
    group.add(sticker);
  }

  const shadowCanvas = document.createElement('canvas'); shadowCanvas.width = shadowCanvas.height = 128;
  const shadowContext = shadowCanvas.getContext('2d')!;
  const gradient = shadowContext.createRadialGradient(64, 64, 12, 64, 64, 64);
  gradient.addColorStop(0, '#3d2f2466'); gradient.addColorStop(.5, '#3d2f2433'); gradient.addColorStop(1, '#3d2f2400');
  shadowContext.fillStyle = gradient; shadowContext.fillRect(0, 0, 128, 128);
  const shadowTexture = new THREE.CanvasTexture(shadowCanvas); textures.push(shadowTexture);
  const shadowMaterial = new THREE.MeshBasicMaterial({ map: shadowTexture, transparent: true, depthWrite: false }); materials.push(shadowMaterial);
  const shadowGeometry = new THREE.PlaneGeometry(width * 1.8, depth * 2.5); geometries.push(shadowGeometry);
  const shadow = new THREE.Mesh(shadowGeometry, shadowMaterial); shadow.rotation.x = -Math.PI / 2; shadow.position.y = -.4; group.add(shadow);
  const fading = materials.map(material => ({ material, opacity: material.opacity, transparent: material.transparent }));
  return { group, width, flaps,
    setOpacity(value: number) { fading.forEach(({ material, opacity, transparent }) => { material.opacity = opacity * value; material.transparent = transparent || value < 1; }); },
    dispose() { disposed = true; geometries.forEach(item => item.dispose()); materials.forEach(item => item.dispose()); textures.forEach(item => item.dispose()); },
  };
}
