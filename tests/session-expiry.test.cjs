const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const ts = require('typescript');

// Use the project's compiler so these tests need no additional test dependencies.
require.extensions['.ts'] = (module, filename) => {
  const source = fs.readFileSync(filename, 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  });
  module._compile(outputText, filename);
};

const tokens = require('../src/lib/api/token.ts');
const { watchSessionExpiry } = require('../src/lib/api/session-expiry.ts');
const jwt = (exp) => `header.${Buffer.from(JSON.stringify({ exp })).toString('base64url')}.signature`;

function browser(t) {
  const cookies = new Map();
  const document = new EventTarget();
  Object.defineProperty(document, 'cookie', {
    get: () => Array.from(cookies, ([name, value]) => `${name}=${value}`).join('; '),
    set: (value) => {
      const [pair] = value.split(';');
      const index = pair.indexOf('=');
      const name = pair.slice(0, index);
      const contents = pair.slice(index + 1);
      if (contents) cookies.set(name, contents);
      else cookies.delete(name);
    },
  });
  global.document = document;
  global.window = new EventTarget();
  t.mock.timers.enable({ apis: ['Date', 'setTimeout'], now: 1_000_000 });
  t.after(() => {
    delete global.document;
    delete global.window;
  });
}

test('JWT expiry rejects expired, malformed and missing expiry values', () => {
  assert.equal(tokens.getTokenExpiresAt(jwt(100)), 100_000);
  assert.equal(tokens.isTokenExpired(jwt(100), 99_999), false);
  assert.equal(tokens.isTokenExpired(jwt(100), 100_000), true);
  for (const token of ['invalid', 'a.@@@.b', jwt('100'), jwt(undefined), jwt(null)]) {
    assert.equal(tokens.isTokenExpired(token, 0), true);
  }
});

test('an already expired refresh token ends the session immediately', (t) => {
  browser(t);
  tokens.setTokens(jwt(2000), jwt(999));
  let expired = 0;
  const stop = watchSessionExpiry(() => { expired++; tokens.clearTokens(); });
  assert.equal(expired, 1);
  assert.equal(tokens.getAccessToken(), null);
  stop();
});

test('an idle session ends exactly at expiry without an API request', (t) => {
  browser(t);
  tokens.setTokens(jwt(1001), jwt(1010));
  let expired = 0;
  const stop = watchSessionExpiry(() => { expired++; tokens.clearTokens(); });
  t.mock.timers.tick(9999);
  assert.equal(expired, 0);
  t.mock.timers.tick(1);
  assert.equal(expired, 1);
  stop();
});

test('rotating tokens reschedules the timer rather than expiring the new session', (t) => {
  browser(t);
  tokens.setTokens(jwt(1001), jwt(1010));
  let expired = 0;
  const stop = watchSessionExpiry(() => { expired++; tokens.clearTokens(); });
  t.mock.timers.tick(5000);
  tokens.setTokens(jwt(1010), jwt(1020));
  t.mock.timers.tick(5000);
  assert.equal(expired, 0);
  t.mock.timers.tick(10000);
  assert.equal(expired, 1);
  stop();
});

test('waking a sleeping tab checks expiry immediately', (t) => {
  browser(t);
  tokens.setTokens(jwt(1001), jwt(1010));
  let expired = 0;
  const stop = watchSessionExpiry(() => { expired++; tokens.clearTokens(); });
  t.mock.timers.setTime(1_020_000);
  window.dispatchEvent(new Event('focus'));
  assert.equal(expired, 1);
  stop();
});

test('cleanup cancels timers and listeners, and signed-out visitors do not expire', (t) => {
  browser(t);
  let expired = 0;
  const stop = watchSessionExpiry(() => expired++);
  assert.equal(expired, 0);
  tokens.setTokens(jwt(1001), jwt(1010));
  stop();
  t.mock.timers.tick(20000);
  window.dispatchEvent(new Event('focus'));
  assert.equal(expired, 0);
});

test('long refresh lifetimes do not overflow the browser timer', (t) => {
  browser(t);
  tokens.setTokens(jwt(1001), jwt(1_000_000_000));
  let expired = 0;
  const stop = watchSessionExpiry(() => expired++);
  t.mock.timers.tick(2_147_483_647);
  assert.equal(expired, 0);
  stop();
});
