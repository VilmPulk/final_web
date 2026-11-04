// Käyttöön tarvittavat komponentit
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Books from './pages/Books';
import Reviews from './pages/Reviews';
import SavedBooks from './pages/SavedBooks';
import Navbar from './components/navbar';

//Sovelluksen pääkomponentti, joka sisältää navigaation ja reitityksen

function App() {
  return (
    <>
      <Navbar />
      <main className="container py-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<Books />} />
          <Route path="/saved" element={<SavedBooks />} />
          <Route path="/reviews" element={<Reviews />} />
        </Routes>
      </main>
    </>
  );
}

export default App;