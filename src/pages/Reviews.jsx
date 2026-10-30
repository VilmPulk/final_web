import { useState } from 'react';
import { getReviews, saveReview } from '../services/reviewStorage';

function loadReviewData() {
  try {
    return { reviews: getReviews(), error: '' };
  } catch (error) {
    return {
      reviews: [],
      error: error instanceof Error
        ? error.message
        : 'Arvostelujen lataaminen epäonnistui.',
    };
  }
}

function Reviews() {
  const [bookTitle, setBookTitle] = useState('');
  const [reviewerName, setReviewerName] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);
  const [reviewData, setReviewData] = useState(loadReviewData);
  const [formError, setFormError] = useState('');
  const { reviews } = reviewData;

  function handleSubmit(event) {
    event.preventDefault();

    if (!bookTitle.trim() || !reviewerName.trim() || !reviewText.trim()) {
      setFormError('Täytä kaikki kentät ennen arvostelun julkaisemista.');
      return;
    }

    const review = {
      id: `${Date.now()}-${reviews.length}`,
      bookTitle: bookTitle.trim(),
      reviewerName: reviewerName.trim(),
      reviewText: reviewText.trim(),
      rating,
      date: new Date().toLocaleDateString('fi-FI', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    };

    try {
      setReviewData({ reviews: saveReview(review), error: '' });
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : 'Arvostelun tallentaminen epäonnistui.',
      );
      return;
    }

    setFormError('');
    setBookTitle('');
    setReviewerName('');
    setReviewText('');
    setRating(5);
  }

  return (
    <section className="reviews-page">
      <header className="reviews-header">
        <span className="reviews-eyebrow">LUKIJOIDEN SUOSITUKSET</span>
        <h1>Kirja-arvostelut</h1>
        <p>
          Jaa ajatuksesi lukemastasi kirjasta ja löydä seuraava suosikkisi
          muiden lukijoiden suosituksista.
        </p>
      </header>

      <div className="reviews-layout">
        <section className="review-form-card" aria-labelledby="review-form-title">
          <h2 id="review-form-title">Kirjoita arvostelu</h2>
          <p className="review-form-intro">Minkä kirjan luit viimeksi?</p>

          <form className="review-form" onSubmit={handleSubmit}>
            {reviewData.error && (
              <p className="review-form-error" role="alert">{reviewData.error}</p>
            )}
            <label htmlFor="review-book-title">Kirjan nimi</label>
            <input
              id="review-book-title"
              type="text"
              value={bookTitle}
              onChange={(event) => setBookTitle(event.target.value)}
              placeholder="Esim. Pieni elämä"
              maxLength={120}
              required
            />

            <label htmlFor="reviewer-name">Nimesi</label>
            <input
              id="reviewer-name"
              type="text"
              value={reviewerName}
              onChange={(event) => setReviewerName(event.target.value)}
              placeholder="Etunimi tai nimimerkki"
              maxLength={60}
              required
            />

            <fieldset className="review-rating">
              <legend>Arvosana</legend>
              <div className="review-rating-options">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    className="review-star"
                    type="button"
                    aria-label={`${value} tähteä`}
                    aria-pressed={rating === value}
                    onClick={() => setRating(value)}
                  >
                    {value <= rating ? '★' : '☆'}
                  </button>
                ))}
                <span className="review-rating-value">{rating} / 5</span>
              </div>
            </fieldset>

            <label htmlFor="review-text">Arvostelusi</label>
            <textarea
              id="review-text"
              value={reviewText}
              onChange={(event) => setReviewText(event.target.value)}
              placeholder="Mikä kirjassa jäi mieleen?"
              rows={5}
              maxLength={1000}
              required
            />

            {formError && <p className="review-form-error" role="alert">{formError}</p>}

            <button className="review-submit" type="submit" disabled={Boolean(reviewData.error)}>
              Julkaise arvostelu
            </button>
          </form>
        </section>

        <section className="review-list" aria-labelledby="review-list-title">
          <div className="review-list-heading">
            <div>
              <span className="reviews-eyebrow">YHTEISÖN LUKUVINKIT</span>
              <h2 id="review-list-title">Tuoreimmat arvostelut</h2>
            </div>
            <span className="review-count">{reviews.length}</span>
          </div>

          {reviews.length === 0 ? (
            <div className="reviews-empty">
              <span className="reviews-empty-icon" aria-hidden="true">✦</span>
              <h3>Ensimmäinen arvostelu odottaa</h3>
              <p>
                Jaa lukukokemuksesi – arvostelusi ilmestyy tähän heti
                julkaisemisen jälkeen.
              </p>
            </div>
          ) : (
            <div className="review-cards">
              {reviews.map((review) => (
                <article className="review-card" key={review.id}>
                  <div className="review-card-top">
                    <div>
                      <h3>{review.bookTitle}</h3>
                      <p className="review-byline">
                        {review.reviewerName} <span aria-hidden="true">·</span>{' '}
                        {review.date}
                      </p>
                    </div>
                    <span
                      className="review-card-rating"
                      aria-label={`Arvosana ${review.rating} viidestä`}
                    >
                      {'★'.repeat(review.rating)}
                      <span className="review-card-rating-muted">
                        {'☆'.repeat(5 - review.rating)}
                      </span>
                    </span>
                  </div>
                  <p className="review-card-text">{review.reviewText}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </section>
  );
}

export default Reviews;