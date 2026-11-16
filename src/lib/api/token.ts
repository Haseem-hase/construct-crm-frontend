const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
export const TOKENS_CHANGED_EVENT = 'constructcrm:tokens-changed';

/** Read expiry for UI scheduling only. The API still verifies JWT signatures. */
export function getTokenExpiresAt(token: string): number | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    return typeof payload.exp === 'number' && Number.isFinite(payload.exp)
      && Number.isFinite(payload.exp * 1000) ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string, now = Date.now()): boolean {
  const expiresAt = getTokenExpiresAt(token);
  return expiresAt === null || expiresAt <= now;
}

function notifyTokensChanged(): void {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(TOKENS_CHANGED_EVENT));
}

function isBrowser(): boolean {
  return typeof document !== 'undefined';
}

function getCookie(name: string): string | null {
  if (!isBrowser()) return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  if (match) return match[2];
  return null;
}

function setCookie(name: string, value: string, days = 30): void {
  if (!isBrowser()) return;
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

function removeCookie(name: string): void {
  if (!isBrowser()) return;
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
}

export function getAccessToken(): string | null {
  return getCookie(ACCESS_TOKEN_KEY);
}

export function setAccessToken(token: string): void {
  setCookie(ACCESS_TOKEN_KEY, token);
  notifyTokensChanged();
}

export function getRefreshToken(): string | null {
  return getCookie(REFRESH_TOKEN_KEY);
}

export function setRefreshToken(token: string): void {
  setCookie(REFRESH_TOKEN_KEY, token);
  notifyTokensChanged();
}

export function setTokens(accessToken: string, refreshToken: string): void {
  setCookie(ACCESS_TOKEN_KEY, accessToken);
  setCookie(REFRESH_TOKEN_KEY, refreshToken);
  notifyTokensChanged();
}

export function clearTokens(): void {
  removeCookie(ACCESS_TOKEN_KEY);
  removeCookie(REFRESH_TOKEN_KEY);
  notifyTokensChanged();
}
