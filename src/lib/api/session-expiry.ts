import { getAccessToken, getRefreshToken, getTokenExpiresAt, TOKENS_CHANGED_EVENT } from './token';

/** End idle sessions at refresh expiry, and recheck after a sleeping tab wakes. */
export function watchSessionExpiry(onExpired: () => void): () => void {
  let timer: ReturnType<typeof setTimeout> | undefined;

  const check = () => {
    clearTimeout(timer);
    const refreshToken = getRefreshToken();
    if (!refreshToken && !getAccessToken()) return;

    const expiresAt = refreshToken ? getTokenExpiresAt(refreshToken) : null;
    const remaining = expiresAt === null ? 0 : expiresAt - Date.now();
    if (remaining <= 0) {
      onExpired();
      return;
    }

    // Browsers overflow delays above a signed 32-bit integer (about 25 days).
    timer = setTimeout(check, Math.min(remaining, 2_147_483_647));
  };

  window.addEventListener(TOKENS_CHANGED_EVENT, check);
  window.addEventListener('focus', check);
  window.addEventListener('pageshow', check);
  document.addEventListener('visibilitychange', check);
  check();

  return () => {
    clearTimeout(timer);
    window.removeEventListener(TOKENS_CHANGED_EVENT, check);
    window.removeEventListener('focus', check);
    window.removeEventListener('pageshow', check);
    document.removeEventListener('visibilitychange', check);
  };
}
