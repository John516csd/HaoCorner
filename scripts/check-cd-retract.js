(async () => {
  // Evaluate on a loaded artist shelf with WebGL; run at desktop and mobile widths.
  const assert = (condition, message) => { if (!condition) throw new Error(message); };
  const canvas = document.querySelector('section[data-collection="false"] > canvas');
  const selected = () => document.querySelector('nav[aria-label="选择专辑"] button[aria-current="true"]');
  const panel = () => document.querySelector('section[aria-label$=" 的歌曲"]');
  const dismiss = () => document.querySelector('button[aria-label="关闭专辑详情，返回唱片架"]');
  const wait = (ms = 1200) => new Promise(resolve => setTimeout(resolve, ms));
  const open = async (ms) => { assert(selected(), 'Start on a selected CD'); selected().click(); await wait(ms); assert(panel(), 'Opening should show songs'); };
  const close = async (ms) => { assert(dismiss(), 'Details should be open'); dismiss().click(); await wait(ms); assert(selected() && !panel(), 'Closing should restore the shelf'); };
  assert(canvas && selected(), 'Start on an artist shelf with WebGL enabled');

  // Warm the current neighborhood before measuring; initial image loading is unrelated to closing.
  await open(); await close();
  const counts = { uploads: 0, deleted: 0 };
  const restores = [];
  for (const prototype of [WebGLRenderingContext.prototype, WebGL2RenderingContext.prototype]) {
    for (const method of ['texImage2D', 'texSubImage2D', 'deleteTexture']) {
      const original = prototype[method];
      prototype[method] = function (...args) {
        if (this.canvas === canvas) counts[method === 'deleteTexture' ? 'deleted' : 'uploads']++;
        return original.apply(this, args);
      };
      restores.push(() => { prototype[method] = original; });
    }
  }
  try {
    for (let cycle = 0; cycle < 3; cycle++) { await open(); await close(); }
    // Reversing an unfinished animation must keep the same GPU resources too.
    await open(80); await close(80); await open(); await close();
    assert(counts.deleted === 0, `Details evicted ${counts.deleted} nearby textures`);
    assert(counts.uploads === 0, `Details re-uploaded ${counts.uploads} textures`);

    document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true, cancelable: true }));
    await wait(1800);
    assert(selected() === document.querySelector('nav[aria-label="选择专辑"] button:last-child'), 'Keyboard browsing should still work');
    assert(counts.deleted > 0, 'Leaving the shelf window should release old GPU textures');
    counts.uploads = counts.deleted = 0;
    await open(); await close();
    assert(counts.uploads === 0 && counts.deleted === 0, 'The new shelf neighborhood should also survive details');
    return `PASS: ${innerWidth}×${innerHeight}; repeated and interrupted returns reuse GPU textures; browsing still evicts distant artwork.`;
  } finally {
    restores.forEach(restore => restore());
  }
})()
