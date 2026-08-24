import { getStore } from '@netlify/blobs';

const STORE_NAME = 'customer-reviews';
const APPROVED_PREFIX = 'approved/';

export function getReviewsStore() {
  return getStore({ name: STORE_NAME, consistency: 'strong' });
}

export function normalizeReview(data, submittedAt = new Date().toISOString()) {
  const name = String(data?.name || '').trim().replace(/\s+/g, ' ');
  const email = String(data?.email || '').trim().toLowerCase();
  const text = String(data?.review || '').trim();
  const rating = Number.parseInt(data?.rating, 10);

  if (!name || name.length > 80) {
    throw new Error('Review name must be between 1 and 80 characters.');
  }
  if (email.length > 254) {
    throw new Error('Review email is too long.');
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new Error('Review rating must be an integer from 1 to 5.');
  }
  if (text.length < 2 || text.length > 2000) {
    throw new Error('Review text must be between 2 and 2000 characters.');
  }

  return {
    id: crypto.randomUUID(),
    name,
    rating,
    review: text,
    submittedAt,
    publishedAt: submittedAt,
    status: 'approved',
  };
}

export async function savePublishedReview(review) {
  const store = getReviewsStore();
  await store.setJSON(`${APPROVED_PREFIX}${review.id}`, review);
}

export async function listReviews(prefix) {
  const store = getReviewsStore();
  const { blobs } = await store.list({ prefix });
  const reviews = await Promise.all(blobs.map(({ key }) => store.get(key, { type: 'json' })));

  return reviews
    .filter(Boolean)
    .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
}

export async function listApprovedReviews() {
  return listReviews(APPROVED_PREFIX);
}

export async function deletePublishedReview(id) {
  const store = getReviewsStore();
  const key = `${APPROVED_PREFIX}${id}`;
  const review = await store.get(key, { type: 'json' });

  if (!review) return false;
  await store.delete(key);
  return true;
}

export function toPublicReview(review) {
  return {
    id: review.id,
    name: review.name,
    rating: review.rating,
    review: review.review,
    submittedAt: review.submittedAt,
    publishedAt: review.publishedAt,
  };
}
