
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <span className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</span>

          <h1>Discover your next great read.</h1>

          <p>
            Explore new stories, find your next favorite
            book and share your thoughts with other readers.
          </p>

          <Link to="/books" className="main-button">
            Etsi kirjoja →
          </Link>
        </div>
      </section>

      <section className="features container py-5">
        <div className="row g-4 text-center">
          <div className="col-md-4">
            <div className="feature-card">
              <span className="feature-icon">📚</span>
              <h3>Discover</h3>
              <p>Explore books from different genres and authors.</p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="feature-card">
              <span className="feature-icon">⭐</span>
              <h3>Review</h3>
              <p>Rate your favorite books and share your opinions.</p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="feature-card">
              <span className="feature-icon">♡</span>
              <h3>Save favorites</h3>
              <p>Keep track of the books you want to read.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="home-bottom container py-4">
        <h2>Every book opens a new world.</h2>
        <p>Find a story that stays with you.</p>
        <Link to="/books" className="main-button">
          Find your next book
        </Link>
      </section>
    </div>
  );
}

export default Home;
