// Tuodaan Reactin renderöinti, reititys, tyylit ja sovelluksen juurikomponentti
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';

// Etsitään HTML:n juurielementti ja liitetään React-sovellus siihen
ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);