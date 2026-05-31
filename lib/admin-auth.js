/* Shared auth + body helpers for the serverless API.
   Imported by api/content.js, api/photo.js, api/login.js. Not a route itself. */
import crypto from 'node:crypto';

/** Constant-time string compare that won't throw on length mismatch. */
export function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

/** True when the request carries the correct admin key header. */
export function authed(req) {
  const pass = process.env.ADMIN_PASSWORD || '';
  if (!pass) return false; // never authorize when the env var is unset
  const key = req.headers['x-admin-key'] || '';
  return safeEqual(String(key), pass);
}

/** Robustly parse a JSON request body across Vercel runtimes. */
export function readJson(req) {
  if (req.body !== undefined && req.body !== null) {
    if (typeof req.body === 'object') return Promise.resolve(req.body);
    if (typeof req.body === 'string') {
      try { return Promise.resolve(JSON.parse(req.body)); } catch { return Promise.resolve(null); }
    }
  }
  return new Promise((resolve) => {
    let data = '';
    req.on('data', (c) => { data += c; if (data.length > 8e6) req.destroy(); });
    req.on('end', () => { try { resolve(data ? JSON.parse(data) : null); } catch { resolve(null); } });
    req.on('error', () => resolve(null));
  });
}
