const STORAGE_KEY = 'lukulista-reviews';

export function getReviews() {
  const savedReviews = window.localStorage.getItem(STORAGE_KEY);

  if (savedReviews === null) {
    return [];
  }

  let reviews;
  try {
    reviews = JSON.parse(savedReviews);
  } catch {
    throw new Error('Tallennettuja arvosteluja ei voitu lukea.');
  }

  if (
    !Array.isArray(reviews)
    || reviews.some((review) => (
      typeof review?.bookTitle !== 'string'
      || typeof review?.reviewerName !== 'string'
      || typeof review?.reviewText !== 'string'
      || !Number.isInteger(review?.rating)
      || review.rating < 1
      || review.rating > 5
    ))
  ) {
    throw new Error('Tallennettujen arvostelujen tiedot ovat virheelliset.');
  }

  return reviews;
}

export function saveReview(review) {
  const updatedReviews = [review, ...getReviews()];
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedReviews));
  return updatedReviews;
}

export function getReviewsForBook(bookTitle, reviews) {
  const normalizeTitle = (title) => title
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('fi')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();

  const normalizedTitle = normalizeTitle(bookTitle);
  return reviews.filter(
    (review) => normalizeTitle(review.bookTitle) === normalizedTitle,
  );
}
