/* GET  /api/content -> the global content+appearance document (or {} -> client defaults)
   POST /api/content -> admin-only; persists the document to Vercel Blob.
   The document shape is { data: { es, en }, appearance: {...} }. */
import { list, put } from '@vercel/blob';
import { authed, readJson } from '../lib/admin-auth.js';

const KEY = 'content.json';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { blobs } = await list({ prefix: KEY, limit: 1 });
      const hit = blobs.find((b) => b.pathname === KEY) || blobs[0];
      res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=60');
      if (!hit) return res.status(200).json({});
      // Cache-bust + no-store so an edit is visible immediately, never a stale CDN copy.
      const r = await fetch(`${hit.url}?_=${Date.now()}`, { cache: 'no-store' });
      if (!r.ok) return res.status(200).json({});
      return res.status(200).json(await r.json());
    } catch {
      return res.status(200).json({}); // fail open: visitors still get data.js defaults
    }
  }

  if (req.method === 'POST') {
    if (!authed(req)) return res.status(401).json({ error: 'unauthorized' });
    const body = await readJson(req);
    if (!body || !body.data || !body.data.es || !body.data.en) {
      return res.status(400).json({ error: 'invalid payload' });
    }
    try {
      const payload = JSON.stringify({ data: body.data, appearance: body.appearance || {} });
      const { url } = await put(KEY, payload, {
        access: 'public',
        contentType: 'application/json',
        addRandomSuffix: false,
        allowOverwrite: true,
        cacheControlMaxAge: 60,
      });
      return res.status(200).json({ ok: true, url });
    } catch (e) {
      return res.status(500).json({ error: String((e && e.message) || e) });
    }
  }

  res.setHeader('Allow', 'GET, POST');
  return res.status(405).json({ error: 'method not allowed' });
}
