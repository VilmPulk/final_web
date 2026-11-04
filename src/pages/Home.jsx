
import { Link } from 'react-router-dom';

function Home() {
  // Etusivu esittelee kirjojen etsimisen, arvostelut ja lukulistalle tallentamisen
  return (
    <div className="home-page">
      {/* Hero-alue toivottaa kävijän tervetulleeksi ja ohjaa kirjojen hakuun*/}
      <section className="hero">
        <div className="hero-content">
          <span className="eyebrow">UUSI LUKUSI ALKAA TÄÄLTÄ</span>

          <h1>Löydä uusi suosikkikirjasi</h1>

          <p>
            Löydä tarinoita, jotka jäävät mieleesi. Tutustu kirjoihin eri genreistä ja kirjoittajilta, lue arvosteluja ja tallenna suosikkisi.
          </p>

          <Link to="/books" className="main-button">
            Etsi kirjoja →
          </Link>
        </div>
      </section>

      {/* Kolme ominaisuuskorttia johtavat sovelluksen toimintoihin */}
      <section className="features container py-5">
        <div className="row g-4 text-center">
          {/* Kirjojen hakunäkymään siirtyminen*/}
          <div className="col-md-4">
            <Link to="/books" className="feature-card feature-card-link">
              <span className="feature-icon">📚</span>
              <h3>Etsi</h3>
              <p>Löydä uusia kirjoja eri genreistä.</p>
            </Link>
          </div>

          {/* Arvostelujen kirjoittamiseen ja lukemiseen siirtyminen*/}
          <div className="col-md-4">
            <Link to="/reviews" className="feature-card feature-card-link">
              <span className="feature-icon">⭐</span>
              <h3>Arvostele</h3>
              <p>Arvostele suosikkikirjasi ja jaa mielipiteesi.</p>
            </Link>
          </div>

          {/* Käyttäjän tallentamien kirjojen lukulistalle siirtyminen*/}
          <div className="col-md-4">
            <Link to="/saved" className="feature-card feature-card-link">
              <span className="feature-icon">♡</span>
              <h3>Tallenna suosikit</h3>
              <p>Tallenna kirjoja, jotka haluat lukea.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Etusivun lopputeksti*/}
      <section className="home-bottom container py-4">
        <h2>Jokainen kirja avaa uuden maailman.</h2>
        <p>Löydä tarina, joka jää mieleen.</p>
      </section>
    </div>
  );
}

// Sivun komponenttia käytetään etusivun reitillä
export default Home;
