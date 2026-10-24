import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve, sep } from 'node:path';
import { BlobsServer } from '@netlify/blobs/server';
import { setEnvironmentContext } from '@netlify/blobs';
import { INITIAL_DEPARTURES, validateDepartures, publicDepartures, parisToday } from '../netlify/lib/weekly-departures.mjs';
import publicHandler from '../netlify/functions/weekly-departures.mjs';
import adminHandler from '../netlify/functions/weekly-departures-admin.mjs';
import { normalizeReview, savePublishedReview, listApprovedReviews, deletePublishedReview } from '../netlify/lib/reviews.mjs';

const directory = await mkdtemp(join(tmpdir(), 'azur-weekly-test-'));
const server = new BlobsServer({ directory, logger: () => {} });
const origin = 'https://example.test';
const previousToken = process.env.WEEKLY_TOURS_ADMIN_TOKEN;
process.env.WEEKLY_TOURS_ADMIN_TOKEN = 'test-only-admin-credential';
const req = (method = 'GET', body, options = {}) => new Request(`${origin}/.netlify/functions/weekly-departures-admin`, {
  method, headers: { authorization: 'Bearer test-only-admin-credential', origin, ...options.headers },
  ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
});
try {
  const { port } = await server.start();
  const apiURL = `http://127.0.0.1:${port}`;
  setEnvironmentContext({ siteID: 'weekly-test', token: 'local-test-only', apiURL, edgeURL: apiURL, uncachedEdgeURL: apiURL });
  // The v10 local emulator omits ETag on GET (its list and conditional PUT do provide it).
  // Supply that header locally so tests exercise the production conditional-write contract.
  const emulatorGet = server.get.bind(server);
  server.get = async request => {
    const response = await emulatorGet(request);
    const match = server.parseAPIRequest(request);
    if (!match?.useSignedURL && response.ok) {
      const { dataPath, key } = server.getLocalPaths(match?.url ?? new URL(request.url, server.address));
      if (dataPath && key) response.headers.set('etag', await BlobsServer.generateETag(dataPath));
    }
    return response;
  };
  assert.equal(parisToday(new Date('2027-03-10T23:30:00Z')), '2027-03-11');
  assert.equal(validateDepartures(INITIAL_DEPARTURES).length, 3);
  for (const change of [{ availableSeats: 7 }, { availableSeats: -1 }, { priceEur: 0 }, { startDate: '2027-02-30' }, { endDate: '2027-03-17' }, { published: 'true' }, { id: '<script>' }]) {
    assert.throws(() => validateDepartures([{ ...INITIAL_DEPARTURES[0], ...change }]));
  }
  assert.throws(() => validateDepartures([INITIAL_DEPARTURES[0], INITIAL_DEPARTURES[0]]));
  assert.equal(publicDepartures(INITIAL_DEPARTURES, '2027-03-19').length, 1);
  assert.equal(publicDepartures(INITIAL_DEPARTURES, '2028-01-01').length, 0);
  assert.equal((await adminHandler(new Request(`${origin}/admin`))).status, 401);
  assert.equal((await adminHandler(req('POST', {}, { headers: { origin: 'https://other.test' } }))).status, 403);
  assert.equal((await publicHandler(req('POST', {}))).status, 405);
  let response = await adminHandler(req()); assert.equal(response.status, 200);
  const initial = await response.json(); assert.equal(initial.etag, null); assert.deepEqual(initial.departures, INITIAL_DEPARTURES);
  assert.equal((await adminHandler(req('POST', { departures: initial.departures }))).status, 400);
  const first = await adminHandler(req('POST', { departures: initial.departures, etag: null })); assert.equal(first.status, 200);
  const saved = await first.json(); assert.ok(saved.etag);
  assert.equal((await adminHandler(req('POST', { departures: initial.departures, etag: null }))).status, 409);
  let data = await (await adminHandler(req())).json();
  assert.equal(typeof data.etag, 'string', JSON.stringify(data));
  data.departures[0].availableSeats = 0;
  data.departures[1].published = false;
  data.departures[2].departureStatus = 'cancelled';
  const updated = await adminHandler(req('POST', data));
  assert.equal(updated.status, 200, await updated.text());
  assert.equal((await adminHandler(req('POST', data))).status, 409);
  const result = await (await publicHandler(req())).json();
  assert.equal(result.departures.length, 1); assert.equal(result.departures[0].availableSeats, 0);
  assert.equal(result.departures[0].capacity, undefined);
  // Existing reviews still work with the Blobs client used for conditional schedule writes.
  const review = normalizeReview({ name: 'Local test', rating: 5, review: 'Local compatibility check' });
  await savePublishedReview(review);
  assert.equal((await listApprovedReviews())[0].id, review.id);
  assert.equal(await deletePublishedReview(review.id), true);
  console.log('PASS: validation, Paris dates, defaults, persistence, hidden/cancelled/past departures, zero seats, auth, origin, stale-write conflicts, reviews compatibility');
} finally {
  await server.stop();
  if (previousToken === undefined) delete process.env.WEEKLY_TOURS_ADMIN_TOKEN; else process.env.WEEKLY_TOURS_ADMIN_TOKEN = previousToken;
  const safeTempRoot = resolve(tmpdir()) + sep;
  if (!resolve(directory).startsWith(safeTempRoot) || !directory.includes('azur-weekly-test-')) throw new Error('Unexpected test directory');
  await rm(directory, { recursive: true, force: true });
}
