import { getBookCoverUrl } from '../services/bookApi';
import { getReviewsForBook } from '../services/reviewStorage';

function BookCard({
  book,
  reviews = [],
  reviewsError = '',
  isSaved = false,
  onToggleSaved,
}) {
  const coverUrl = getBookCoverUrl(book);
  const authors = book.author_name?.join(', ') || 'Tekijää ei ilmoitettu';
  const bookReviews = getReviewsForBook(book.title, reviews);
  const averageRating = bookReviews.length
    ? bookReviews.reduce((total, review) => total + review.rating, 0) / bookReviews.length
    : 0;

  return (
    <article className="book-card">
      {coverUrl && (
        <img
          className="book-card-cover"
          src={coverUrl}
          alt={`Kirjan ${book.title} kansi`}
          loading="lazy"
        />
      )}
      <div className="book-card-body">
        <h2>{book.title}</h2>
        <p>{authors}</p>
        {book.first_publish_year && (
          <p className="book-card-year">
            <small>
              Julkaisuvuosi: {book.first_publish_year}
            </small>
          </p>
        )}
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
        <section className="book-community-reviews" aria-label={`Yhteisön arvostelut: ${book.title}`}>
          <h3>Yhteisön arvostelut</h3>
          {reviewsError ? (
            <p className="book-reviews-error" role="alert">{reviewsError}</p>
          ) : bookReviews.length > 0 ? (
            <>
              <p className="book-community-summary">
                <span aria-label={`${averageRating.toFixed(1)} tähteä viidestä`}>
                  ★ {averageRating.toFixed(1)} / 5
                </span>
                {' · '}
                {bookReviews.length} {bookReviews.length === 1 ? 'arvostelu' : 'arvostelua'}
              </p>
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
            <p className="book-reviews-empty">Ei vielä yhteisön arvosteluja.</p>
          )}
        </section>
      </div>
    </article>
  );
}

export default BookCard;