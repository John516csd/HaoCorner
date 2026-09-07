(async () => {
// With /eason open: browse eval scripts/check-eason-details.js
// Run at desktop and mobile widths, with WebGL enabled and disabled.
  const assert = (condition, message) => { if (!condition) throw new Error(message); };
  const panel = () => document.querySelector('section[aria-label="U87 的歌曲"]');
  const dismiss = () => document.querySelector('button[aria-label="关闭专辑详情，返回唱片架"]');
  const settle = async () => {
    await new Promise(resolve => setTimeout(resolve, 30));
    await Promise.all(document.getAnimations().map(animation => animation.finished.catch(() => {})));
  };
  const open = async () => {
    document.querySelector('nav[aria-label="选择专辑"] button').click();
    await settle();
    assert(panel(), 'Album should open');
  };
  if (dismiss()) { dismiss().click(); await settle(); }
  assert(!document.querySelector('a[href="/#music"]'), 'Shelf branding should be removed');
  await open();
  assert(!document.querySelector('a[href="/#music"]'), 'Detail branding should be removed');
  assert(!document.querySelector('a[href*="coverbox"]'), 'CoverBox link should be removed');
  assert(!document.body.innerText.includes('Apple Music 中国区'), 'Album footer should be removed');
  assert(!document.body.innerText.includes('返回唱片架'), 'Visible close control should be removed');
  assert(!document.body.innerText.includes('©'), 'Copyright footer should be removed');
  assert(panel() === document.activeElement, 'Opening should focus the song panel');
  assert(panel().querySelectorAll('li').length === 12, 'U87 should retain all 12 tracks');

  const compact = innerWidth < 760;
  document.elementFromPoint(innerWidth * (compact ? .5 : .265), compact ? 180 : innerHeight / 2).click();
  await settle();
  assert(panel(), 'Clicking the cover must not dismiss the album');
  const song = panel().querySelector('a[href]');
  let clicked = false;
  song.addEventListener('click', event => { event.preventDefault(); clicked = true; }, { once: true });
  song.click();
  await settle();
  assert(clicked && panel(), 'Song clicks must remain interactive without dismissing');
  assert(song.href.startsWith('https://music.apple.com/cn/song/'), 'Song destination should be preserved');

  for (const [x, y] of [[20, 20], [innerWidth - 20, 20], [innerWidth / 2, 80], [innerWidth * .8, innerHeight - 12]]) {
    const target = document.elementFromPoint(x, y);
    assert(target === dismiss(), `Blank point ${x},${y} should reach the backdrop`);
    target.click();
    await settle();
    assert(!panel(), 'Clicking blank space should close details');
    assert(document.activeElement?.getAttribute('aria-label')?.startsWith('打开 '), 'Closing should restore focus');
    await open();
  }
  document.activeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  await settle();
  assert(!panel(), 'Escape should close details');
  await open();
  return `PASS: ${innerWidth}x${innerHeight}; removed controls, cover, songs, blank dismissal, Escape, focus.`;
})()
