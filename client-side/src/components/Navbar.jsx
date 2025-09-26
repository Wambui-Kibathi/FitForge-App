import { Link } from 'react-router-dom';
import { FaSun, FaMoon, FaDumbbell, FaUser, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import { useState } from 'react';

function Navbar({ darkMode, toggleDarkMode, user, onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <FaDumbbell /> FitForge
      </Link>
      <button 
        className="hamburger" 
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? <FaTimes /> : <FaBars />}
      </button>
      
      <ul className={`navbar-nav ${isMenuOpen ? 'nav-open' : ''}`}>
        <li><Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
        <li><Link to="/users" className="nav-link" onClick={() => setIsMenuOpen(false)}>Users</Link></li>
        <li><Link to="/instructors" className="nav-link" onClick={() => setIsMenuOpen(false)}>Instructors</Link></li>
        <li><Link to="/exercises" className="nav-link" onClick={() => setIsMenuOpen(false)}>Exercises</Link></li>
        <li><Link to="/workouts" className="nav-link" onClick={() => setIsMenuOpen(false)}>Workouts</Link></li>
        <li><Link to="/profile" className="nav-link" onClick={() => setIsMenuOpen(false)}><FaUser /> Profile</Link></li>
        <li>
          <span className="nav-link">
            Welcome, {user?.name} {user?.is_admin && '(Admin)'}
          </span>
        </li>
        <li>
          <button onClick={onLogout} className="theme-toggle">
            <FaSignOutAlt />
          </button>
        </li>
        <li>
          <button onClick={toggleDarkMode} className="theme-toggle">
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;