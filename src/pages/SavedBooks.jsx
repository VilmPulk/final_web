import { useState } from 'react';
import { Link } from 'react-router-dom';
import BookCard from '../components/BookCard';
import { getReviews } from '../services/reviewStorage';
import { getBookId, getSavedBooks, removeSavedBook, saveBook } from '../services/savedBooks';

// Lataa selaimen tallennustilasta arvostelut ja lukulistalle tallennetut kirjat
function loadPageData() {
  // Alustetaan oletusarvot, jotta sivu voi näyttää tyhjän tilan virhetilanteessa
  const data = { reviews: [], savedBooks: [], error: '' };

  // Haetaan arvostelut, joita näytetään tallennettujen kirjojen yhteydessä
  try {
    data.reviews = getReviews();
  } catch (error) {
  // Säilytetään luettava virheviesti sivulla näytettäväksi
    data.error = error instanceof Error
      ? error.message
      : 'Arvostelujen lataaminen epäonnistui.';
  }

  // Haetaan käyttäjän tallentamat kirjat omasta selaintallennustilasta
  try {
    data.savedBooks = getSavedBooks();
  } catch (error) {
  // Tallennettujen kirjojen latausvirhe näytetään käyttäjälle
    data.error = error instanceof Error
      ? error.message
      : 'Tallennettujen kirjojen lataaminen epäonnistui.';
  }

  // Palautetaan sekä onnistuneet tiedot, että mahdollinen virhe
  return data;
}

function SavedBooks() {
  // Sivun React-tila sisältää kirjat, arvostelut ja mahdollisen virheviestin
  const [pageData, setPageData] = useState(loadPageData);

  // Lisää kirjan lukulistalle tai poistaa sen, jos se on jo tallennettu
  function handleToggleSaved(book) {
    try {
      // Verrataan kirjojen tunnisteita, jotta tunnistetaan oikea tallennettu kirja
      const isSaved = pageData.savedBooks.some(
        (savedBook) => getBookId(savedBook) === getBookId(book),
      );
      // Päivitetään selaintallennus sen mukaan, oliko kirja jo listalla
      const savedBooks = isSaved
        ? removeSavedBook(book)
        : saveBook(book);
      // Päivitetään näkymä vastaamaan tallennuksen uutta sisältöä ja tyhjennetään virhe
      setPageData((currentData) => ({ ...currentData, savedBooks, error: '' }));
    } catch (error) {
      // Näytetään tallennuksen epäonnistumisesta saatu tai oletusarvoinen virhe
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
      {/* Sivun otsikko ja sisältö muodostavat käyttäjän oman lukulistan*/}
      <header className="saved-header">
        <span className="books-eyebrow">OMA LUKULISTASI</span>
        <h1>Tallennetut kirjat</h1>
        <p>Pidä kiinnostavat kirjat tallessa ja palaa niihin myöhemmin.</p>
      </header>

      {/* Roolimääritys kertoo lukijalle, että kyseessä on virheilmoitus*/}
      {pageData.error && <p className="books-error saved-error" role="alert">{pageData.error}</p>}

      {/* Näytetään ohje ja linkki hakuun, jos lukulista on tyhjä */}
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
        <>
          {/* Jos lukulistalla on kirjoja, jokainen esitetään omana korttinaan */}
          <div className="books-results">
            {pageData.savedBooks.map((book) => {
              // Kortille välitetään kirjan tunniste, tiedot, arvostelut ja tallennustoiminto
              return (
                <BookCard
                  key={getBookId(book)}
                  book={book}
                  reviews={pageData.reviews}
                  reviewsError={pageData.error}
                  isSaved
                  onToggleSaved={handleToggleSaved}
                />
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}

// Sivun komponenttia käytetään reitissä /saved
export default SavedBooks;
