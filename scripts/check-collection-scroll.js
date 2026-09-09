// On /music at a phone-sized viewport with Reduce Motion enabled, wait for covers to load and run in the browser console.
(async () => {
  const root = document.querySelector('[data-collection-cached="true"]');
  if (!root) throw new Error('Open /music at a phone-sized viewport with Reduce Motion enabled first');
  const scroller = root.querySelector('[data-visible="true"]');
  const max = scroller.scrollHeight - scroller.clientHeight;
  if (max <= 0) throw new Error('Use a viewport short enough to scroll the collection');
  for (const preview of scroller.querySelectorAll('[data-music-box] canvas')) {
    const rect = preview.getBoundingClientRect();
    if (rect.top >= innerHeight || rect.bottom <= 0) continue;
    const pixels = preview.getContext('2d').getImageData(0, 0, preview.width, preview.height).data;
    if (!pixels.some((value, index) => index % 4 === 3 && value > 0)) throw new Error('Visible box preview is blank');
  }
  const gl = WebGL2RenderingContext.prototype, originals = new Map();
  const previousScroll = scroller.scrollTop, frames = [];
  let drawCalls = 0, previous = performance.now();
  for (const method of ['drawElements', 'drawArrays', 'drawElementsInstanced', 'drawArraysInstanced']) {
    originals.set(method, gl[method]);
    gl[method] = function (...args) { drawCalls++; return originals.get(method).apply(this, args); };
  }
  try {
    for (let i = 0; i < 120; i++) {
      await new Promise(requestAnimationFrame);
      const now = performance.now(); frames.push(now - previous); previous = now;
      scroller.scrollTop = max * (.5 - .5 * Math.cos(i * Math.PI / 15));
    }
    await new Promise(requestAnimationFrame);
    if (drawCalls) throw new Error(`Scrolling triggered ${drawCalls} WebGL draws; wait for covers and retry`);
    const result = { drawCalls, frames: frames.length, p95FrameMs: frames.sort((a, b) => a - b)[114] };
    console.log('PASS: native collection scroll uses no WebGL draws', result);
    return result;
  } finally {
    for (const [method, original] of originals) gl[method] = original;
    scroller.scrollTop = previousScroll;
  }
})();
