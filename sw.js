// src/loader/sw.js — 検証ServiceWorkerプロキシ（DESIGN.md §3.1）
//
// 「照合したバイト＝実行するバイト」を結ぶ実行層。ローダー独自オリジンの scope '/' に登録され、
// ツール自身の静的ファイルを除く同一オリジンリクエストを横取りし、運営イミュータブル配信元から
// 取得したバイトを manifest(=チェーン錨で照合済み) と sha256 照合してから返す。
// 1バイトでも不一致なら拒否。
//
// バンドラでは処理しない（生の SW として配信）。verify-core.js のロジックは重複を避けるため
// ここでは最小限を inline 再実装する（SWは import できるが、依存を減らし監査面を小さくするため）。
//
// メッセージプロトコル（ローダーページ → SW）:
//   { type: 'INSTALL_MANIFEST', manifest, bundleOrigin, connectExtra }  検証済み manifest を注入
//   { type: 'CLEAR' }                                                    無効化
// STATE は Cache API に保存し、SW のアイドル破棄後も再読込する。永続 STATE が無い navigation は
// SW の対象外である /index.html（ローダーUI）へ戻し、本体アセットは未検証のまま配信しない。

let STATE = null; // { files, bundleOrigin, csp }
const EXTERNAL_READ_TIMEOUT_MS = 5000;
const STATE_CACHE_NAME = 'coinu-verification-loader-state-v1';
const STATE_CACHE_KEY = `${self.location.origin}/.coinu-verification-loader-state-v1`;
const TOOL_ASSET_PATHS = new Set([
  '/index.html',
  '/loader.bundle.js',
  '/recovery.html',
  '/recovery.bundle.js',
  '/sw.js',
  '/build-info.json',
]);

self.addEventListener('install', (e) => { self.skipWaiting(); });
self.addEventListener('activate', (e) => { e.waitUntil(self.clients.claim()); });

function makeState(msg) {
  return {
    files: msg.manifest.files,
    buildVersion: msg.manifest.buildVersion,
    bundleOrigin: String(msg.bundleOrigin).replace(/\/+$/, ''),
    csp: msg.csp || null,
  };
}

function isValidState(value) {
  return !!value
    && typeof value === 'object'
    && value.files !== null
    && typeof value.files === 'object'
    && !Array.isArray(value.files)
    && Object.entries(value.files).every(([path, hash]) => path.startsWith('/') && typeof hash === 'string')
    && (typeof value.buildVersion === 'string' || typeof value.buildVersion === 'number')
    && typeof value.bundleOrigin === 'string'
    && value.bundleOrigin.length > 0
    && (value.csp === null || typeof value.csp === 'string');
}

async function persistState(value) {
  const cache = await caches.open(STATE_CACHE_NAME);
  await cache.put(STATE_CACHE_KEY, new Response(JSON.stringify(value), {
    headers: { 'Content-Type': 'application/json' },
  }));
}

async function restoreState() {
  if (STATE) return STATE;
  try {
    const cache = await caches.open(STATE_CACHE_NAME);
    const response = await cache.match(STATE_CACHE_KEY);
    if (!response) return null;
    const value = await response.json();
    if (!isValidState(value)) {
      await cache.delete(STATE_CACHE_KEY);
      return null;
    }
    STATE = value;
    return STATE;
  } catch {
    return null;
  }
}

self.addEventListener('message', (e) => {
  const msg = e.data || {};
  if (msg.type === 'INSTALL_MANIFEST') {
    const nextState = makeState(msg);
    const install = (async () => {
      try {
        if (!isValidState(nextState)) throw new Error('invalid manifest state');
        await persistState(nextState);
        STATE = nextState;
        if (e.source) e.source.postMessage({ type: 'MANIFEST_INSTALLED', fileCount: Object.keys(STATE.files).length });
      } catch (error) {
        STATE = null;
        if (e.source) e.source.postMessage({
          type: 'MANIFEST_INSTALL_FAILED',
          error: String(error?.message || error),
        });
      }
    })();
    e.waitUntil(install);
  } else if (msg.type === 'CLEAR') {
    const clear = (async () => {
      STATE = null;
      try {
        const cache = await caches.open(STATE_CACHE_NAME);
        await cache.delete(STATE_CACHE_KEY);
        if (e.source) e.source.postMessage({ type: 'CLEARED' });
      } catch (error) {
        if (e.source) e.source.postMessage({ type: 'CLEAR_FAILED', error: String(error?.message || error) });
      }
    })();
    e.waitUntil(clear);
  }
});

const enc = new TextEncoder();
const toHex = (bytes) => Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');

async function sha256Hex(bytes) {
  const buf = await crypto.subtle.digest('SHA-256', bytes);
  return toHex(new Uint8Array(buf));
}

async function withExternalReadTimeout(operation, label) {
  const controller = new AbortController();
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => {
      controller.abort();
      reject(new Error(`${label} timed out after ${EXTERNAL_READ_TIMEOUT_MS}ms`));
    }, EXTERNAL_READ_TIMEOUT_MS);
  });
  try {
    return await Promise.race([operation(controller.signal), timeout]);
  } finally {
    clearTimeout(timer);
  }
}

// URL パス → manifest パス候補（verify-core.candidateManifestPaths と同一規則）
function candidatePaths(urlPath) {
  const p = urlPath.split('?')[0].split('#')[0];
  if (p.endsWith('/')) return [`${p}index.html`];
  const out = [p];
  const last = p.split('/').pop();
  if (!last.includes('.')) out.push(`${p}/index.html`, `${p}.html`);
  return out;
}
function resolvePath(files, urlPath) {
  for (const c of candidatePaths(urlPath)) if (Object.prototype.hasOwnProperty.call(files, c)) return c;
  return null;
}

function refuse(status, reason) {
  return new Response(
    `<!doctype html><meta charset="utf-8"><title>verification failed</title>` +
    `<body style="font-family:system-ui;padding:2rem"><h1>検証に失敗しました</h1>` +
    `<p>reason: ${reason}</p><p>このバイトは配信されません（配り分け/改竄/未検証の疑い）。` +
    `復元クライアントから参加してください。</p></body>`,
    { status, headers: { 'Content-Type': 'text/html; charset=utf-8' } },
  );
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // 同一オリジン（＝アプリ本体のアセット）のみ検証対象。外部（フォント/WC/運営worker/RPC/リレー）は
  // CSP で script 実行を封じたうえでパススルー（build の一部ではない）。
  if (url.origin !== self.location.origin) return; // ブラウザの既定 fetch に委ねる

  // ローダー／復元クライアント自身は本体 manifest の一部ではない。実在するツール配布物だけを
  // 完全一致で除外し、'/'・'/_next/*'・その他の本体パスは必ず下の検証を通す。
  if (TOOL_ASSET_PATHS.has(url.pathname)) return;

  event.respondWith((async () => {
    const state = await restoreState();
    if (!state) {
      if (req.mode === 'navigate') {
        return Response.redirect(`${self.location.origin}/index.html`, 302);
      }
      return refuse(503, 'manifest not installed (loader must verify first)');
    }
    const manifestPath = resolvePath(state.files, url.pathname);
    if (!manifestPath) return refuse(404, `not in manifest: ${url.pathname}`);

    // 運営イミュータブル配信元から生バイト取得
    let upstream;
    let bytes;
    try {
      ({ upstream, bytes } = await withExternalReadTimeout(async (signal) => {
        const response = await fetch(`${state.bundleOrigin}${manifestPath}`, {
          cache: 'no-store', redirect: 'error', signal,
        });
        if (!response.ok) return { upstream: response, bytes: null };
        return { upstream: response, bytes: new Uint8Array(await response.arrayBuffer()) };
      }, `bundle file ${manifestPath}`));
    } catch (e) {
      return refuse(502, `fetch failed: ${manifestPath}`);
    }
    if (!upstream.ok) {
      return refuse(upstream.status === 503 ? 503 : 502, `upstream ${upstream.status}: ${manifestPath}`);
    }
    const actual = await sha256Hex(bytes);
    if (actual !== state.files[manifestPath]) {
      return refuse(409, `hash mismatch: ${manifestPath}`);
    }

    // 検証OK → 適切な Content-Type と CSP を付けて返す
    const headers = new Headers();
    const ct = upstream.headers.get('Content-Type');
    if (ct) headers.set('Content-Type', ct);
    else headers.set('Content-Type', guessContentType(manifestPath));
    headers.set('X-Verified-Build', String(state.buildVersion));
    if (state.csp && manifestPath.endsWith('.html')) headers.set('Content-Security-Policy', state.csp);
    return new Response(bytes, { status: 200, headers });
  })());
});

function guessContentType(path) {
  if (path.endsWith('.html')) return 'text/html; charset=utf-8';
  if (path.endsWith('.js')) return 'application/javascript';
  if (path.endsWith('.json')) return 'application/json';
  if (path.endsWith('.css')) return 'text/css';
  if (path.endsWith('.svg')) return 'image/svg+xml';
  if (path.endsWith('.png')) return 'image/png';
  if (path.endsWith('.ico')) return 'image/x-icon';
  if (path.endsWith('.woff2')) return 'font/woff2';
  return 'application/octet-stream';
}
