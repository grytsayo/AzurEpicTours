import { listApprovedReviews, toPublicReview } from '../lib/reviews.mjs';

const JSON_HEADERS = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store',
};

export default async function handler(request) {
  if (request.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...JSON_HEADERS, allow: 'GET' },
    });
  }

  try {
    const reviews = await listApprovedReviews();
    return new Response(JSON.stringify({ reviews: reviews.map(toPublicReview) }), {
      status: 200,
      headers: JSON_HEADERS,
    });
  } catch (error) {
    console.error('Could not load public reviews:', error);
    return new Response(JSON.stringify({ error: 'Reviews are temporarily unavailable' }), {
      status: 500,
      headers: JSON_HEADERS,
    });
  }
}
