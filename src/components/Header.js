import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Header.css';
import logo from '../public/logo.png';

const Header = ({ isLoggedIn, username, onLogout }) => {

  const handleLogout = () => {
    localStorage.removeItem('accessToken'); // Remove token from local storage
    onLogout(); // Call the logout function passed as a prop
  };

  return (
    <header className={`header ${isLoggedIn ? 'logged-in' : 'logged-out'}`}>
      <div className="logo">
        <img src={logo} alt="Logo" />
      </div>
      <div className="auth-links">
        {isLoggedIn ? (
          <>
            <span className="profile">Welcome {username}!</span>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="login-link">Login</Link>
            <span className="separator">|</span>
            <Link to="/register" className="register-link">Register</Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
