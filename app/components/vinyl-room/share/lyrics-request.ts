import type { LyricCandidate } from './types';

const RETRY_DELAYS = [600, 1200];
export const LYRIC_MAX_RETRIES = RETRY_DELAYS.length;
const FAILURE_MESSAGE = '歌词加载失败，请重试。';

class LyricRequestError extends Error {
  retryable: boolean;

  constructor(message: string, retryable: boolean) {
    super(message);
    this.retryable = retryable;
  }
}

function waitToRetry(delay: number, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    signal.throwIfAborted();
    const cancel = () => { clearTimeout(timer); reject(signal.reason); };
    const timer = setTimeout(() => {
      signal.removeEventListener('abort', cancel);
      resolve();
    }, delay);
    signal.addEventListener('abort', cancel, { once: true });
  });
}

export async function requestLyrics(url: string, { signal, onRetry }: {
  signal: AbortSignal; onRetry: (retry: number) => void;
}): Promise<LyricCandidate[]> {
  for (let attempt = 0; ; attempt++) {
    signal.throwIfAborted();
    try {
      const response = await fetch(url, { signal });
      const data = await response.json().catch(() => null);
      signal.throwIfAborted();
      if (!response.ok) {
        throw new LyricRequestError(typeof data?.error === 'string' ? data.error : FAILURE_MESSAGE,
          response.status >= 500 || response.status === 408 || response.status === 429);
      }
      if (!Array.isArray(data?.candidates)) throw new LyricRequestError(FAILURE_MESSAGE, true);
      // A successful search with no matches is final, not a temporary service failure.
      return data.candidates;
    } catch (error) {
      signal.throwIfAborted();
      if (attempt >= LYRIC_MAX_RETRIES || (error instanceof LyricRequestError && !error.retryable)) {
        throw new Error(error instanceof LyricRequestError ? error.message : FAILURE_MESSAGE);
      }
      onRetry(attempt + 1);
      await waitToRetry(RETRY_DELAYS[attempt], signal);
    }
  }
}
