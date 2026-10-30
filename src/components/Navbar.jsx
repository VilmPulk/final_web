import { NavLink } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar navbar-expand navbar-light bg-light px-3">
      <div className="navbar-nav">
        <NavLink className="nav-link" to="/">
          Etusivu
        </NavLink>
        <NavLink className="nav-link" to="/books">
          Haku
        </NavLink>
        <NavLink className="nav-link" to="/reviews">
          Arvostelut
        </NavLink>
      </div>
    </nav>
  );
}

export default Navbar;