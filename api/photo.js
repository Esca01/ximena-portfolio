/* POST /api/photo -> admin-only; stores a profile photo in Vercel Blob.
   Body: { dataBase64, contentType }. Returns { url }. A random suffix gives each
   upload a unique, cache-safe URL. */
import { put } from '@vercel/blob';
import { authed, readJson } from '../lib/admin-auth.js';

const OK = ['image/png', 'image/jpeg', 'image/webp', 'image/avif'];

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method not allowed' });
  }
  if (!authed(req)) return res.status(401).json({ error: 'unauthorized' });

  const body = await readJson(req);
  const dataBase64 = body && body.dataBase64;
  if (!dataBase64) return res.status(400).json({ error: 'no image' });

  const contentType = OK.includes(body.contentType) ? body.contentType : 'image/webp';
  const ext = contentType.split('/')[1];

  let buf;
  try { buf = Buffer.from(dataBase64, 'base64'); } catch { return res.status(400).json({ error: 'bad data' }); }
  if (!buf.length) return res.status(400).json({ error: 'empty' });
  if (buf.length > 5 * 1024 * 1024) return res.status(413).json({ error: 'too large' });

  try {
    const { url } = await put(`photo.${ext}`, buf, {
      access: 'public',
      contentType,
      addRandomSuffix: true,
    });
    return res.status(200).json({ url });
  } catch (e) {
    return res.status(500).json({ error: String((e && e.message) || e) });
  }
}
