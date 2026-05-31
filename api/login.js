/* POST /api/login -> validates the admin password against ADMIN_PASSWORD (timing-safe).
   On 200 the client keeps the password in sessionStorage and sends it as the
   x-admin-key header on subsequent writes. */
import { readJson, safeEqual } from '../lib/admin-auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method not allowed' });
  }
  const body = await readJson(req);
  const password = (body && body.password) || '';
  const real = process.env.ADMIN_PASSWORD || '';
  if (real && safeEqual(String(password), real)) {
    return res.status(200).json({ ok: true });
  }
  return res.status(401).json({ ok: false });
}
