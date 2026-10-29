import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Books from './pages/Books';
import Reviews from './pages/Reviews';
import Navbar from './components/Navbar';

function App() {
  return (
    <>
      <Navbar />
      <main className="container py-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<Books />} />
          <Route path="/reviews" element={<Reviews />} />
        </Routes>
      </main>
    </>
  );
}

export default App;