import { useState } from 'react';
import BookCard from '../components/BookCard';
import { searchBooks } from '../services/bookApi';
import { getReviews } from '../services/reviewStorage';
import { getBookId, getSavedBooks, removeSavedBook, saveBook } from '../services/savedBooks';

function loadPageData() {
  try {
    return { reviews: getReviews(), savedBooks: getSavedBooks(), error: '' };
  } catch (error) {
    return {
      reviews: [],
      savedBooks: [],
      error: error instanceof Error
        ? error.message
        : 'Tallennustietojen lataaminen epäonnistui.',
    };
  }
}

function Books() {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [pageData, setPageData] = useState(loadPageData);

  function handleToggleSaved(book) {
    try {
      const isSaved = pageData.savedBooks.some(
        (savedBook) => getBookId(savedBook) === getBookId(book),
      );
      const savedBooks = isSaved
        ? removeSavedBook(book)
        : saveBook(book);
      setPageData((currentData) => ({ ...currentData, savedBooks, error: '' }));
    } catch (saveError) {
      setPageData((currentData) => ({
        ...currentData,
        error: saveError instanceof Error
          ? saveError.message
          : 'Kirjan tallentaminen epäonnistui.',
      }));
    }
  }

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
        {pageData.error && <p className="books-error" role="alert">{pageData.error}</p>}
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
              reviews={pageData.reviews}
              reviewsError={pageData.error}
              isSaved={pageData.savedBooks.some(
                (savedBook) => getBookId(savedBook) === getBookId(book),
              )}
              onToggleSaved={handleToggleSaved}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default Books;