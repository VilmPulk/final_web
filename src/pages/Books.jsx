import { useState } from 'react';
import BookCard from '../components/BookCard';
import { searchBooks } from '../services/bookApi';
import { getReviews } from '../services/reviewStorage';
import { getBookId, getSavedBooks, removeSavedBook, saveBook } from '../services/savedBooks';

// Lataa arvostelut ja lukulistalle tallennetut kirjat selaimen tallennustilasta
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
  // Hakusana, hakutulokset ja haun tila tallennetaan React-tilaan
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  // Kirjakortit tarvitsevat arvostelut ja tiedon tallennetuista kirjoista
  const [pageData, setPageData] = useState(loadPageData);

  // Lisää kirjan lukulistalle tai poistaa sen ja päivittää näkymän
  function handleToggleSaved(book) {
    try {
      // Selvitetään tunnisteen avulla, onko kirja jo tallennettu
      const isSaved = pageData.savedBooks.some(
        (savedBook) => getBookId(savedBook) === getBookId(book),
      );
      // Päivitetään selaimen lukulista valitun toiminnon mukaisesti
      const savedBooks = isSaved
        ? removeSavedBook(book)
        : saveBook(book);
      // Päivitetään sivun tila ja poistetaan aiempi tallennusvirhe
      setPageData((currentData) => ({ ...currentData, savedBooks, error: '' }));
    } catch (saveError) {
      // Säilytetään tallennusvirhe käyttäjälle näytettäväksi
      setPageData((currentData) => ({
        ...currentData,
        error: saveError instanceof Error
          ? saveError.message
          : 'Kirjan tallentaminen epäonnistui.',
      }));
    }
  }

  // Tekee kirjahakupyynnön ja päivittää tulokset sekä virhe- ja lataustilat
  async function handleSubmit(event) {
    event.preventDefault();
    const searchTerm = query.trim();

    // Tyhjää hakusanaa ei lähetetä hakupalveluun
    if (!searchTerm) {
      return;
    }

    // Käynnistää lataustilan ja merkitsee haun alkaneeksi
    setIsLoading(true);
    setError('');
    setHasSearched(true);

    try {
      // Haetaan tulokset kirjahakupalvelusta
      const results = await searchBooks(searchTerm);
      setBooks(results);
    } catch (requestError) {
      // Tyhjennetään vanhat tulokset ja asetetaan haun virheviesti
      setBooks([]);
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Kirjojen hakeminen epäonnistui.',
      );
    } finally {
      // Lopetetaan lataustila sekä onnistuneen että epäonnistuneen haun jälkeen
      setIsLoading(false);
    }
  }

  return (
    <section className="books-page">
      {/* Hakusivun otsikko ja hakulomake käynnistävät kirjahakua */}
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

      {/* Hakupalaute kertoo latauksesta, virheestä tai tuloksettomasta hausta */}
      <div className="books-feedback">
        {isLoading && <p role="status">Haetaan kirjoja…</p>}
        {error && <p className="books-error" role="alert">{error}</p>}
        {pageData.error && <p className="books-error" role="alert">{pageData.error}</p>}
        {!isLoading && !error && hasSearched && books.length === 0 && (
          <p>Kirjoja ei löytynyt. Kokeile toista hakusanaa.</p>
        )}
      </div>

      {/* Hakutulokset näytetään kirjakortteina, joille välitetään arvostelu- ja tallennustiedot */}
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

// Sivun komponenttia käytetään kirjojen hakureitillä
export default Books;