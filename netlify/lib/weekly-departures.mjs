import { getStore } from '@netlify/blobs';

export const INITIAL_DEPARTURES = [
  { id: 'art-2027-03-11', startDate: '2027-03-11', endDate: '2027-03-16' },
  { id: 'art-2027-03-18', startDate: '2027-03-18', endDate: '2027-03-23' },
  { id: 'art-2027-03-25', startDate: '2027-03-25', endDate: '2027-03-30' },
].map(d => ({ ...d, capacity: 6, availableSeats: 6, priceEur: 1200, published: true, departureStatus: 'forming' }));

export function parisToday(now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
}

function validDate(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T12:00:00Z`)) && new Date(`${value}T12:00:00Z`).toISOString().slice(0, 10) === value;
}

export function validateDepartures(input) {
  if (!Array.isArray(input) || input.length > 100) throw new Error('Expected up to 100 departures');
  const ids = new Set();
  return input.map(d => {
    if (!d || typeof d.id !== 'string' || !/^[a-z0-9-]{1,80}$/.test(d.id) || ids.has(d.id)) throw new Error('Invalid or duplicate departure ID');
    ids.add(d.id);
    if (!validDate(d.startDate) || !validDate(d.endDate)) throw new Error('Invalid dates');
    if ((Date.parse(d.endDate) - Date.parse(d.startDate)) / 86400000 !== 5) throw new Error('This tour must cover six days');
    if (!Number.isInteger(d.capacity) || d.capacity < 1 || d.capacity > 50) throw new Error('Capacity must be 1–50');
    if (d.availableSeats !== null && (!Number.isInteger(d.availableSeats) || d.availableSeats < 0 || d.availableSeats > d.capacity)) throw new Error('Available seats must be 0–capacity, or null');
    if (!Number.isInteger(d.priceEur) || d.priceEur < 1 || d.priceEur > 100000) throw new Error('Invalid price');
    if (typeof d.published !== 'boolean' || !['forming', 'confirmed', 'cancelled'].includes(d.departureStatus)) throw new Error('Invalid status');
    return { id: d.id, startDate: d.startDate, endDate: d.endDate, capacity: d.capacity, availableSeats: d.availableSeats, priceEur: d.priceEur, published: d.published, departureStatus: d.departureStatus };
  }).sort((a, b) => a.startDate.localeCompare(b.startDate) || a.id.localeCompare(b.id));
}

export function publicDepartures(departures, today = parisToday()) {
  return departures.filter(d => d.published && d.departureStatus !== 'cancelled' && d.startDate >= today)
    .map(({ id, startDate, endDate, availableSeats, priceEur, departureStatus }) => ({ id, startDate, endDate, availableSeats, priceEur, departureStatus }));
}

export function departureStore() { return getStore({ name: 'weekly-tours', consistency: 'strong' }); }
export async function readSchedule(store = departureStore()) {
  const record = await store.getWithMetadata('schedule', { type: 'json' });
  if (record && !record.etag) throw new Error('Missing storage version');
  return record ? { departures: validateDepartures(record.data.departures), etag: record.etag, updatedAt: record.data.updatedAt } : { departures: structuredClone(INITIAL_DEPARTURES), etag: null, updatedAt: null };
}

export async function writeSchedule(departures, etag, store = departureStore()) {
  const data = { departures: validateDepartures(departures), updatedAt: new Date().toISOString() };
  const result = await store.setJSON('schedule', data, etag === null ? { onlyIfNew: true } : { onlyIfMatch: etag });
  return { ...result, updatedAt: data.updatedAt };
}

export const json = (body, status = 200, headers = {}) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff', ...headers } });
