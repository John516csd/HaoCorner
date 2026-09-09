// Open /music, wait for the collection, then run this file in the browser console.
(async () => {
  const check = (ok, message) => { if (!ok) throw new Error(message); };
  const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
  const wait = async predicate => { for (let i = 0; i < 200; i++) { if (predicate()) return; await pause(25); } throw new Error(`Timed out: ${predicate}`); };
  check(location.pathname === '/music', 'Start on /music');
  await wait(() => document.querySelector('[data-room-theme]')?.getAttribute('aria-busy') === 'false');
  const gl = WebGL2RenderingContext.prototype, uploadsByMethod = new Map(['texImage2D', 'texSubImage2D'].map(method => [method, gl[method]])), dispose = gl.deleteTexture;
  const textures = new Set(), reports = [];
  let peak = 0, uploads = 0, releases = 0;
  for (const [method, upload] of uploadsByMethod) gl[method] = function (...args) {
    const source = args.at(-1);
    if (source instanceof HTMLImageElement && source.src.includes('/covers/') && source.naturalWidth > 256) {
      textures.add(this.getParameter(this.TEXTURE_BINDING_2D)); uploads++;
      peak = Math.max(peak, textures.size);
    }
    return upload.apply(this, args);
  };
  gl.deleteTexture = function (texture) { if (textures.delete(texture)) releases++; return dispose.call(this, texture); };
  try {
    const ids = [...new Set([...document.querySelectorAll('[data-walk-box]')].map(link => link.getAttribute('href').slice(1)))];
    check(ids.length === 10, 'All ten artists must have collection entries');
    for (const id of ids) {
      const link = document.querySelector(`[data-walk-box][href="/${id}"]`);
      document.querySelector('[data-room-theme]').dataset.instant = 'true';
      link.dispatchEvent(new CustomEvent('focus-collection-box', { bubbles: true, detail: link.dataset.walkBox }));
      await wait(() => link.dataset.near === 'true');
      link.click();
      await wait(() => location.pathname === `/${id}` && document.querySelector('[data-room-theme]').getAttribute('aria-busy') === 'false');
      await pause(200);
      const count = document.querySelectorAll('nav[aria-label="选择专辑"] button').length;
      check(count > 4, `${id}: catalog was truncated`);
      for (let index = 0; index < count; index++) {
        const button = document.querySelectorAll('nav[aria-label="选择专辑"] button')[index];
        button.scrollIntoView({ block: 'nearest' });
        const rect = button.getBoundingClientRect();
        check(rect.top >= 0 && rect.bottom <= innerHeight, `${id}: unreachable album ${index}`);
        const title = button.getAttribute('aria-label').replace(/^打开 /, '').replace(/ 的歌曲列表$/, '');
        button.click();
        await wait(() => document.querySelector('[class*="track-panel"] h2')?.textContent === title);
        const panel = document.querySelector('[class*="track-panel"]');
        check(panel.querySelectorAll('li').length > 0, `${id}/${title}: empty track list`);
        panel.querySelector('button').click();
        await wait(() => !document.querySelector('[class*="track-panel"]'));
      }
      check(document.documentElement.scrollWidth === innerWidth, `${id}: horizontal overflow`);
      document.querySelector('a[href="/music"][class*="back-collection"]').click();
      await wait(() => location.pathname === '/music' && document.querySelector('[data-collection-scroll]').dataset.visible === 'true');
      await pause(200);
      reports.push({ id, albums: count });
    }
    await pause(300);
    check(uploads > 0 && releases > 0, 'WebGL cover upload and disposal must both be exercised');
    check(peak <= 24, `Too many full-size covers retained: ${peak}`);
    check(textures.size === 0, `Full-size covers retained in collection: ${textures.size}`);
    const result = { viewport: innerWidth, reports, albums: reports.reduce((n, r) => n + r.albums, 0), peakFullSizeTextures: peak, uploads, releases };
    console.log('PASS: complete catalog and bounded cover textures', result);
    return result;
  } finally { for (const [method, upload] of uploadsByMethod) gl[method] = upload; gl.deleteTexture = dispose; }
})();
