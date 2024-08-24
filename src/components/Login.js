import React, { useState } from 'react';
import { request } from '../api'; // Import the request function
import '../css/Login.css'; // Import the CSS file

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Function to validate email address
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!isValidEmail(username)) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      const response = await request('POST', '/api/auth/login', {
        username,
        password
      });
      const { accessToken } = response.data;

      onLogin(accessToken);
      setIsLoggedIn(true);
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please check your username and password.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login</h2>
        {isLoggedIn && <p className="success-message">Logged in successfully!</p>}
        <form onSubmit={handleLogin}>
          <div>
            <label htmlFor="username">Email:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Login</button>
          {error && <p>{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;
