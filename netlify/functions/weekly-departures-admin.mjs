import { timingSafeEqual } from 'node:crypto';
import { json, readSchedule, validateDepartures, writeSchedule } from '../lib/weekly-departures.mjs';

export default async function handler(request) {
  // Reuse the existing owner's admin credential; never send or embed it in the public page.
  const expected = Buffer.from(process.env.WEEKLY_TOURS_ADMIN_TOKEN || process.env.REVIEW_ADMIN_TOKEN || '');
  const actual = Buffer.from(request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') || '');
  if (!expected.length || actual.length !== expected.length || !timingSafeEqual(expected, actual)) return json({ error: 'Unauthorized' }, 401, { 'www-authenticate': 'Bearer' });
  if (request.method === 'GET') {
    try { return json(await readSchedule()); } catch { return json({ error: 'Could not load schedule' }, 503); }
  }
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405, { allow: 'GET, POST' });
  if (request.headers.get('origin') !== new URL(request.url).origin) return json({ error: 'Invalid origin' }, 403);
  let body;
  try {
    const raw = await request.text();
    if (raw.length > 60000) return json({ error: 'Request too large' }, 413);
    body = JSON.parse(raw);
    if (body.etag !== null && (typeof body.etag !== 'string' || body.etag.length > 300)) throw new Error('Missing schedule version');
    body.departures = validateDepartures(body.departures);
  } catch (error) { return json({ error: error.message || 'Invalid schedule' }, 400); }
  try {
    const result = await writeSchedule(body.departures, body.etag);
    if (!result.modified) return json({ error: 'Schedule changed in another session. Reload before saving.' }, 409);
    return json({ ok: true, etag: result.etag, updatedAt: result.updatedAt });
  } catch { return json({ error: 'Could not save schedule' }, 503); }
}
