import { useState } from 'react';
import { getReviews, saveReview } from '../services/reviewStorage';

// Lataa aiemmin tallennetut arvostelut ja palauttaa virheen sivun näytettäväksi
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
  // Lomakekenttien arvot ja valittu tähtiarvosana pidetään React-tilassa
  const [bookTitle, setBookTitle] = useState('');
  const [reviewerName, setReviewerName] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);
  // Arvostelut alustetaan selaimen tallennustilasta ja lomakevirhe on erillinen
  const [reviewData, setReviewData] = useState(loadReviewData);
  const [formError, setFormError] = useState('');
  const { reviews } = reviewData;

  // Tarkistaa lomakkeen, tallentaa uuden arvostelun ja tyhjentää kentät onnistumisen jälkeen
  function handleSubmit(event) {
    event.preventDefault();

    // Estetään tyhjien tai pelkistä välilyönneistä koostuvien tietojen julkaisu
    if (!bookTitle.trim() || !reviewerName.trim() || !reviewText.trim()) {
      setFormError('Täytä kaikki kentät ennen arvostelun julkaisemista.');
      return;
    }

    // Muodostetaan arvostelutietue siistityistä kenttäarvoista ja tämänhetkisestä päivämäärästä
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

    // Tallennetaan arvostelu ja virheen sattuessa näytetään tallennuspalvelun virheviesti
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

    // Tyhjennetään onnistuneesti julkaistun arvostelun lomake ja palautetaan oletusarvosana
    setFormError('');
    setBookTitle('');
    setReviewerName('');
    setReviewText('');
    setRating(5);
  }

  return (
    <section className="reviews-page">
      {/* Sivun esittely */}
      <header className="reviews-header">
        <span className="reviews-eyebrow">LUKIJOIDEN SUOSITUKSET</span>
        <h1>Kirja-arvostelut</h1>
        <p>
          Jaa ajatuksesi lukemastasi kirjasta ja löydä seuraava suosikkisi
          muiden lukijoiden suosituksista.
        </p>
      </header>

      <div className="reviews-layout">
        {/* Arvostelulomakkeella annetaan kirjan tiedot, arvosana ja arvio */}
        <section className="review-form-card" aria-labelledby="review-form-title">
          <h2 id="review-form-title">Kirjoita arvostelu</h2>
       <form className="review-form" onSubmit={handleSubmit}>
            {/* Tallennettujen arvostelujen latausvirhe näytetään lomakkeessa */}
            {reviewData.error && (
              <p className="review-form-error" role="alert">{reviewData.error}</p>
            )}
            <label htmlFor="review-book-title">Kirjan nimi</label>
            <input
              id="review-book-title"
              type="text"
              value={bookTitle}
              onChange={(event) => setBookTitle(event.target.value)}
              maxLength={120}
              required
            />

            <label htmlFor="reviewer-name">Nimesi</label>
            <input
              id="reviewer-name"
              type="text"
              value={reviewerName}
              onChange={(event) => setReviewerName(event.target.value)}
              maxLength={60}
              required
            />

            {/* Tähtipainikkeilla valitaan arvosana */}
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
              rows={5}
              maxLength={1000}
              required
            />

            {/* Lomakevirhe ilmoitetaan käyttäjälle ja julkaisu estyy latausvirheen aikana*/}
            {formError && <p className="review-form-error" role="alert">{formError}</p>}

            <button className="review-submit" type="submit" disabled={Boolean(reviewData.error)}>
              Julkaise arvostelu
            </button>
          </form>
        </section>

        {/* Arvostelulista näyttää arvostelujen määrän, tyhjän tilan tai arvostelukortit*/}
        <section className="review-list" aria-labelledby="review-list-title">
          <div className="review-list-heading">
            <div>
              <span className="reviews-eyebrow">YHTEISÖN LUKUVINKIT</span>
              <h2 id="review-list-title">Uusimmat arvostelut</h2>
            </div>
            <span className="review-count">{reviews.length}</span>
          </div>

          {/* Jos arvosteluja ei ole, kehotetaan julkaisemaan */}
          {reviews.length === 0 ? (
            <div className="reviews-empty">
              <span className="reviews-empty-icon" aria-hidden="true">✦</span>
              <h3>Ensimmäinen arvostelu odottaa</h3>
              <p>
                Jaa lukukokemuksesi – arvostelusi ilmestyy tähän julkaisemisen jälkeen.
              </p>
            </div>
          ) : (
            // Muussa tapauksessa jokainen arvostelu näytetään omana korttinaan
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

// Sivun komponenttia käytetään arvostelujen reitillä
export default Reviews;