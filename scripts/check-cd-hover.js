(async () => {
  // With a vinyl room open: browse eval scripts/check-cd-hover.js
  const assert = (condition, message) => { if (!condition) throw new Error(message); };
  const canvas = document.querySelector('canvas');
  assert(canvas && document.querySelector('nav[aria-label="选择专辑"]'), 'Start on the CD shelf');
  const move = (y, pointerType) => canvas.dispatchEvent(new PointerEvent('pointermove', {
    clientX: innerWidth / 2, clientY: y, pointerType, isPrimary: true, bubbles: true,
  }));
  const supportsHover = matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (supportsHover) {
    let hit = false;
    for (let y = 130; y < innerHeight - 120; y += 20) {
      move(y, 'mouse');
      if (canvas.style.cursor === 'pointer') { hit = true; break; }
    }
    assert(hit, 'Mouse should discover a CD through raycasting');
    canvas.dispatchEvent(new PointerEvent('pointerleave'));
    assert(canvas.style.cursor === '', 'Leaving should clear hover feedback');
  }
  move(innerHeight / 2, 'touch');
  assert(canvas.style.cursor === '', 'Touch must not leave a sticky hover state');
  canvas.dispatchEvent(new PointerEvent('pointerleave'));
  document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true, cancelable: true }));
  await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  const buttons = [...document.querySelectorAll('nav[aria-label="选择专辑"] button')];
  assert(buttons.at(-1).getAttribute('aria-current') === 'true', 'Keyboard focus should select the last CD immediately');
  buttons[0].click();
  await new Promise(resolve => setTimeout(resolve, 50));
  assert(document.querySelector('section[aria-label$=" 的歌曲"]'), 'CD selection should still open tracks');
  assert(canvas.style.cursor === '', 'Opening a CD should clear hover');
  if (supportsHover) {
    const area = document.querySelector('div[class*="detail-cover"]');
    assert(area, 'Detail CD should have a stable hover area');
    const point = (x, y) => {
      const rect = area.getBoundingClientRect();
      area.dispatchEvent(new PointerEvent('pointermove', { clientX: rect.left + rect.width * x, clientY: rect.top + rect.height * y, pointerType: 'mouse', bubbles: true }));
    };
    const frame = async (x, y) => {
      point(x, y);
      await new Promise(resolve => requestAnimationFrame(resolve));
      return canvas.toDataURL();
    };
    await new Promise(resolve => setTimeout(resolve, 1200));
    const neutral = await frame(.5, .5);
    point(.85, .2); await new Promise(resolve => setTimeout(resolve, 650));
    const tilted = await frame(.85, .2);
    assert(tilted !== neutral, 'Moving across a CD should change its rendered pose');
    area.dispatchEvent(new PointerEvent('pointerout', { bubbles: true, relatedTarget: document.body }));
    await new Promise(resolve => setTimeout(resolve, 650));
    const restored = await frame(.5, .5);
    assert(restored === neutral, 'Leaving the CD should return it to its neutral pose');
  }
  return `PASS: ${innerWidth}px CD picking, hover cleanup, touch protection, keyboard selection, and details.`;
})()
