import { useState } from 'react';
import BookCard from '../components/BookCard';
import { searchBooks } from '../services/bookApi';

function Books() {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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
    <section>
      <h1>Kirjat</h1>
      <form className="row g-2 justify-content-center mb-4" onSubmit={handleSubmit}>
        <div className="col-12 col-md-8">
          <label className="visually-hidden" htmlFor="book-search">
            Hae kirjoja
          </label>
          <input
            id="book-search"
            className="form-control"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Hae kirjan nimellä tai tekijällä"
            required
          />
        </div>
        <div className="col-auto">
          <button className="btn btn-primary" type="submit" disabled={isLoading}>
            {isLoading ? 'Haetaan…' : 'Hae'}
          </button>
        </div>
      </form>

      {isLoading && <p role="status">Haetaan kirjoja…</p>}
      {error && <p className="text-danger" role="alert">{error}</p>}
      {!isLoading && !error && hasSearched && books.length === 0 && (
        <p>Kirjoja ei löytynyt.</p>
      )}

      {books.length > 0 && (
        <div className="row g-4 text-start">
          {books.map((book) => (
            <div className="col-12 col-sm-6 col-lg-4" key={book.key}>
              <BookCard book={book} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Books;