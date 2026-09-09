import assert from 'node:assert/strict';
import { test } from 'node:test';
import { LYRIC_MAX_RETRIES, requestLyrics } from '../app/components/vinyl-room/share/lyrics-request.ts';

const candidate = { id: 1, lyrics: '测试第一行\n测试第二行', exact: true };
const success = () => Response.json({ candidates: [candidate] });

async function scenario(respond, run) {
  const original = globalThis.fetch;
  let calls = 0;
  const retries = [];
  const controller = new AbortController();
  globalThis.fetch = (...args) => respond(++calls, ...args);
  try {
    await run({
      load: (onRetry = retry => retries.push(retry)) => requestLyrics('/api/lyrics?track=1', { signal: controller.signal, onRetry }),
      calls: () => calls, retries, controller,
    });
  } finally { globalThis.fetch = original; }
}

test('temporary HTTP and network failures recover within the default retry budget', async () => {
  await scenario(async call => {
    if (call === 1) return Response.json({ error: '服务暂时不可用' }, { status: 502 });
    if (call === 2) throw new TypeError('Network unavailable');
    return success();
  }, async ({ load, calls, retries }) => {
    assert.deepEqual(await load(), [candidate]);
    assert.equal(calls(), 3);
    assert.equal(LYRIC_MAX_RETRIES, 2);
    assert.deepEqual(retries, [1, 2]);
  });
});

test('persistent failures stop after three requests and manual retry gets a fresh budget', async () => {
  await scenario(async () => Response.json({ error: '服务暂时不可用' }, { status: 503 }), async ({ load, calls, retries }) => {
    await assert.rejects(load(), /服务暂时不可用/);
    assert.equal(calls(), 3);
    assert.deepEqual(retries, [1, 2]);
    await assert.rejects(load(), /服务暂时不可用/);
    assert.equal(calls(), 6);
  });
});

test('missing songs and successful empty searches do not retry automatically', async () => {
  await scenario(async () => Response.json({ error: '未找到歌曲' }, { status: 404 }), async ({ load, calls }) => {
    await assert.rejects(load(), /未找到歌曲/);
    assert.equal(calls(), 1);
  });
  await scenario(async () => Response.json({ candidates: [] }), async ({ load, calls }) => {
    assert.deepEqual(await load(), []);
    assert.equal(calls(), 1);
  });
});

test('timeout and rate-limit responses can recover', async () => {
  await scenario(async call => call < 3 ? new Response('', { status: call === 1 ? 408 : 429 }) : success(), async ({ load, calls }) => {
    assert.deepEqual(await load(), [candidate]);
    assert.equal(calls(), 3);
  });
});

test('invalid success payloads recover instead of leaving a broken lyric view', async () => {
  await scenario(async call => call === 1 ? Response.json({ candidates: null }) : success(), async ({ load, calls }) => {
    assert.deepEqual(await load(), [candidate]);
    assert.equal(calls(), 2);
  });
});

test('leaving during the retry delay cancels without another request', async () => {
  await scenario(async () => new Response('', { status: 502 }), async ({ load, calls, controller }) => {
    await assert.rejects(load(() => queueMicrotask(() => controller.abort())), { name: 'AbortError' });
    assert.equal(calls(), 1);
    await assert.rejects(load(), { name: 'AbortError' });
    assert.equal(calls(), 1, 'An already cancelled load must not fetch');
  });
});

test('a cancelled in-flight request never schedules retries', async () => {
  await scenario((_call, _url, { signal }) => new Promise((_resolve, reject) => {
    signal.addEventListener('abort', () => reject(signal.reason), { once: true });
  }), async ({ load, calls, retries, controller }) => {
    const pending = load();
    controller.abort();
    await assert.rejects(pending, { name: 'AbortError' });
    assert.equal(calls(), 1);
    assert.deepEqual(retries, []);
  });
});
