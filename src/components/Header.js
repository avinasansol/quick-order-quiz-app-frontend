import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/Header.css';
import logo from '../public/logo.png';

const Header = ({ isLoggedIn, username, onLogout }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = () => {
    const offset = window.scrollY;
    if (offset > 50) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    onLogout();
  };

  return (
    <header className={`header ${isScrolled ? 'shrink' : ''} ${isLoggedIn ? 'logged-in' : 'logged-out'}`}>
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
