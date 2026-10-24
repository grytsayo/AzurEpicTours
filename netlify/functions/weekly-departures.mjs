import { json, publicDepartures, readSchedule } from '../lib/weekly-departures.mjs';

export default async function handler(request) {
  if (request.method !== 'GET') return json({ error: 'Method not allowed' }, 405, { allow: 'GET' });
  try {
    const schedule = await readSchedule();
    return json({ departures: publicDepartures(schedule.departures) });
  } catch {
    return json({ error: 'Availability temporarily unavailable' }, 503);
  }
}
