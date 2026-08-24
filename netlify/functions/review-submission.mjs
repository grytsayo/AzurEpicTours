import { normalizeReview, savePublishedReview } from '../lib/reviews.mjs';

export default {
  async formSubmitted(event) {
    const data = event?.data || {};
    const isReviewForm = data['form-name'] === 'customer-review' ||
      (Object.hasOwn(data, 'rating') && Object.hasOwn(data, 'review'));

    if (!isReviewForm) return;

    try {
      const review = normalizeReview(data);
      await savePublishedReview(review);
      console.log(`Published verified review ${review.id}.`);
    } catch (error) {
      console.error('Could not publish verified review:', error.message);
      throw error;
    }
  },
};
