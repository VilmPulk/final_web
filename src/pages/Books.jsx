import { useState } from 'react';
import BookCard from '../components/BookCard';
import { searchBooks } from '../services/bookApi';
import { getReviews } from '../services/reviewStorage';

function loadReviewData() {
  try {
    return { reviews: getReviews(), error: '' };
  } catch (error) {
    return {
      reviews: [],
      error: error instanceof Error
        ? error.message
        : 'Yhteisön arvostelujen lataaminen epäonnistui.',
    };
  }
}

function Books() {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [reviewData] = useState(loadReviewData);

  async function handleSubmit(event) {
    event.preventDefault();
    const searchTerm = query.trim();

    if (!searchTerm) {
      return;
    }

    setIsLoading(true);
    setError('');
    setHasSearched(true);

    try {
      const results = await searchBooks(searchTerm);
      setBooks(results);
    } catch (requestError) {
      setBooks([]);
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Kirjojen hakeminen epäonnistui.',
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="books-page">
      <header className="books-header">
        <span className="books-eyebrow">LÖYDÄ SEURAAVA LUKUELÄMYS</span>
        <h1>Etsi kirjoja</h1>
        <p>Hae kirjoja nimen tai kirjailijan perusteella.</p>
        <form className="books-search-form" onSubmit={handleSubmit}>
          <label className="visually-hidden" htmlFor="book-search">
            Etsi kirjan nimellä tai kirjailijalla
          </label>
          <input
            id="book-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Kirjan nimi tai kirjailija"
            required
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Haetaan…' : 'Etsi kirjoja'}
          </button>
        </form>
      </header>

      <div className="books-feedback">
        {isLoading && <p role="status">Haetaan kirjoja…</p>}
        {error && <p className="books-error" role="alert">{error}</p>}
        {!isLoading && !error && hasSearched && books.length === 0 && (
          <p>Kirjoja ei löytynyt. Kokeile toista hakusanaa.</p>
        )}
      </div>

      {books.length > 0 && (
        <div className="books-results">
          {books.map((book) => (
            <BookCard
              key={book.key}
              book={book}
              reviews={reviewData.reviews}
              reviewsError={reviewData.error}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default Books;