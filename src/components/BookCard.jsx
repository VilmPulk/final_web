import { getBookCoverUrl } from '../services/bookApi';
import { getReviewsForBook } from '../services/reviewStorage';

// Näyttää kirjan tiedot, tallennustoiminnon ja kirjaan liittyvät yhteisöarvostelut
function BookCard({
  book,
  reviews = [],
  reviewsError = '',
  isSaved = false,
  onToggleSaved,
}) {
  // Muodostetaan kannen osoite, tekijärivi ja kirjaan liittyvät arvostelut
  const coverUrl = getBookCoverUrl(book);
  const authors = book.author_name?.join(', ') || 'Tekijää ei ilmoitettu';
  const bookReviews = getReviewsForBook(book.title, reviews);
  // Lasketaan keskiarvo vain silloin, kun kirjalla on arvosteluja.
  const averageRating = bookReviews.length
    ? bookReviews.reduce((total, review) => total + review.rating, 0) / bookReviews.length
    : 0;

  return (
    <article className="book-card">
      {/* Kirjan kansi näytetään vain, jos hakupalvelu palautti sen osoitteen */}
      {coverUrl && (
        <img
          className="book-card-cover"
          src={coverUrl}
          alt={`Kirjan ${book.title} kansi`}
          loading="lazy"
        />
      )}
      <div className="book-card-body">
        {/* Kirjan perustiedot: nimi, tekijät ja saatavilla oleva julkaisuvuosi*/}
        <h2>{book.title}</h2>
        <p>{authors}</p>
        {book.first_publish_year && (
          <p className="book-card-year">
            <small>
              Julkaisuvuosi: {book.first_publish_year}
            </small>
          </p>
        )}
        {/* Tallennuspainike näytetään, jos komponentille annettiin tallennustoiminto*/}
        {onToggleSaved && (
          <button
            className={`save-book-button${isSaved ? ' is-saved' : ''}`}
            type="button"
            aria-pressed={isSaved}
            onClick={() => onToggleSaved(book)}
          >
            {isSaved ? '♥ Tallennettu' : '♡ Tallenna'}
          </button>
        )}
        {/* Arvosteluosio näyttää virheen, kirjan arvostelut tai tyhjän tilan */}
        <section className="book-community-reviews" aria-label={`Yhteisön arvostelut: ${book.title}`}>
          <h3>Yhteisön arvostelut</h3>
          {reviewsError ? (
            <p className="book-reviews-error" role="alert">{reviewsError}</p>
          ) : bookReviews.length > 0 ? (
            <>
              {/* Yhteenveto näyttää kirjan keskiarvon ja arvostelujen lukumäärän*/}
              <p className="book-community-summary">
                <span aria-label={`${averageRating.toFixed(1)} tähteä viidestä`}>
                  ★ {averageRating.toFixed(1)} / 5
                </span>
                {' · '}
                {bookReviews.length} {bookReviews.length === 1 ? 'arvostelu' : 'arvostelua'}
              </p>
              {/* Listataan yksittäiset arvostelut ja niiden kirjoittajat sekä arvosanat*/}
              <div className="book-community-review-list">
                {bookReviews.map((review) => (
                  <article className="book-community-review" key={review.id}>
                    <p className="book-community-review-meta">
                      <strong>{review.reviewerName}</strong>
                      {' · '}
                      <span aria-label={`${review.rating} tähteä viidestä`}>
                        {'★'.repeat(review.rating)}
                      </span>
                    </p>
                    <p>{review.reviewText}</p>
                  </article>
                ))}
              </div>
            </>
          ) : (
            <p className="book-reviews-empty">Ei vielä arvosteluja.</p>
          )}
        </section>
      </div>
    </article>
  );
}

// Komponenttia käytetään yksittäisen kirjan esittämiseen hakutuloksissa ja lukulistalla
export default BookCard;