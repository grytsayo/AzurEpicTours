import { timingSafeEqual } from 'node:crypto';
import {
  deletePublishedReview,
  listApprovedReviews,
  normalizeReview,
  savePublishedReview,
} from '../lib/reviews.mjs';

const JSON_HEADERS = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store',
  'x-content-type-options': 'nosniff',
};

function json(body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...JSON_HEADERS, ...extraHeaders },
  });
}

function isAuthorized(request) {
  const configuredToken = process.env.REVIEW_ADMIN_TOKEN || '';
  const suppliedToken = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') || '';

  if (!configuredToken || !suppliedToken) return false;

  const expected = Buffer.from(configuredToken);
  const actual = Buffer.from(suppliedToken);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

function hasSameOrigin(request) {
  const origin = request.headers.get('origin');
  return !origin || origin === new URL(request.url).origin;
}

export default async function handler(request) {
  if (!isAuthorized(request)) {
    return json({ error: 'Unauthorized' }, 401, { 'www-authenticate': 'Bearer' });
  }

  if (request.method === 'GET') {
    try {
      return json({ reviews: await listApprovedReviews() });
    } catch (error) {
      console.error('Could not load published reviews:', error);
      return json({ error: 'Could not load published reviews' }, 500);
    }
  }

  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405, { allow: 'GET, POST' });
  }

  if (!hasSameOrigin(request)) {
    return json({ error: 'Invalid origin' }, 403);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  const id = String(body?.id || '');
  const action = String(body?.action || '');
  if (action === 'publish') {
    const submittedAt = new Date(body?.submittedAt || Date.now());
    if (Number.isNaN(submittedAt.getTime())) {
      return json({ error: 'Invalid submission date' }, 400);
    }

    try {
      const review = normalizeReview(body?.review, submittedAt.toISOString());
      await savePublishedReview(review);
      return json({ ok: true, id: review.id });
    } catch (error) {
      return json({ error: error.message || 'Invalid review' }, 400);
    }
  }

  if (!/^[a-f0-9-]{36}$/i.test(id) || action !== 'delete') {
    return json({ error: 'Invalid review management request' }, 400);
  }

  try {
    const result = await deletePublishedReview(id);
    if (!result) return json({ error: 'Published review not found' }, 404);
    return json({ ok: true });
  } catch (error) {
    console.error('Could not delete review:', error);
    return json({ error: 'Review management action failed' }, 500);
  }
}
