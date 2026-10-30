import { useState } from 'react';
import { Link } from 'react-router-dom';
import BookCard from '../components/BookCard';
import { getReviews } from '../services/reviewStorage';
import { getBookId, getSavedBooks, removeSavedBook, saveBook } from '../services/savedBooks';

function loadPageData() {
  const data = { reviews: [], savedBooks: [], error: '' };

  try {
    data.reviews = getReviews();
  } catch (error) {
    data.error = error instanceof Error
      ? error.message
      : 'Yhteisön arvostelujen lataaminen epäonnistui.';
  }

  try {
    data.savedBooks = getSavedBooks();
  } catch (error) {
    data.error = error instanceof Error
      ? error.message
      : 'Tallennettujen kirjojen lataaminen epäonnistui.';
  }

  return data;
}

function SavedBooks() {
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
    } catch (error) {
      setPageData((currentData) => ({
        ...currentData,
        error: error instanceof Error
          ? error.message
          : 'Tallennettujen kirjojen päivittäminen epäonnistui.',
      }));
    }
  }

  return (
    <section className="saved-page">
      <header className="saved-header">
        <span className="books-eyebrow">OMA LUKULISTASI</span>
        <h1>Tallennetut kirjat</h1>
        <p>Pidä kiinnostavat kirjat tallessa ja palaa niihin myöhemmin.</p>
      </header>

      {pageData.error && <p className="books-error saved-error" role="alert">{pageData.error}</p>}

      {pageData.savedBooks.length === 0 ? (
        <div className="saved-empty">
          <span className="reviews-empty-icon" aria-hidden="true">♡</span>
          <h2>Ei vielä tallennettuja kirjoja</h2>
          <p>
            Löydä kiinnostava kirja hausta ja tallenna se lukulistallesi.
          </p>
          <Link className="main-button" to="/books">Etsi kirjoja</Link>
        </div>
      ) : (
        <div className="books-results">
          {pageData.savedBooks.map((book) => (
            <BookCard
              key={getBookId(book)}
              book={book}
              reviews={pageData.reviews}
              reviewsError={pageData.error}
              isSaved
              onToggleSaved={handleToggleSaved}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default SavedBooks;
