import './css/App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header'; // Import the Header component
import Footer from './components/Footer'; // Import the Footer component
import Login from './components/Login'; // Import the Login component
import Register from './components/Register'; // Import the Register component
import UserList from './components/UserList';
import { request } from './api'; // Import the request function
import Cookies from 'js-cookie';
import Question from './components/Question';
import AppStatus from './components/AppStatus';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState(''); // Add state to store the username

  // Function to check if the user is logged in
  const checkLoginStatus = () => {
    const localToken = localStorage.getItem('accessToken');
    const cookieToken = Cookies.get('accessToken'); 
    if (localToken || cookieToken) {
      setIsLoggedIn(true);
      request("GET", "/api/user/me", {})
              .then(response => {
                const userData = response.data; // Use a local variable to store the response data
                setUsername(userData.name); // Use userData directly instead of data
                if(userData.userRole === "Admin") {
                  setIsAdmin(true);
                }
              })
              .catch(error => {
                  console.log('Error fetching data: might be token timmed off.');
              });
      if(!localToken){
        localStorage.setItem('accessToken', cookieToken);
      }
    } else {
      setIsLoggedIn(false);
      setIsAdmin(false);
      setUsername(''); // Clear the username if no token
    }
  };

  useEffect(() => {
    checkLoginStatus(); // Check login status when the component mounts
  }, []);

  const handleLogin = (token) => {
    setIsLoggedIn(true);
    localStorage.setItem('accessToken', token);
    Cookies.set('accessToken', token); // Store the token in a cookie
    request("GET", "/api/user/me", {})
            .then(response => {
              const userData = response.data; // Use a local variable to store the response data
              setUsername(userData.name); // Use userData directly instead of data
              if(userData.userRole === "Admin") {
                setIsAdmin(true);
              }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    setUsername(''); // Clear the username on logout
    localStorage.removeItem('accessToken'); // Ensure token is removed from local storage
    Cookies.remove('accessToken'); // Remove token from cookies
  };

  return (
    <Router>
      <div> {/* Add padding to prevent content from overlapping with footer */}
        <Header isLoggedIn={isLoggedIn} username={username} onLogout={handleLogout} />
        <div>
          {isAdmin && (<AppStatus />)}
          <Routes>
            <Route 
              path="/login" 
              element={isLoggedIn ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} 
            />
            <Route 
              path="/register" 
              element={isLoggedIn ? <Navigate to="/" /> : <Register />} 
            />
            <Route 
            path="*" 
            element={isLoggedIn ? (
              <>
                {username === '' ? (
                  <>
                    <p>Error fetching data! It might be a network issue or a session timeout.</p>
                    <p>Please try to log out and log in again!</p>
                  </>
                ) : (
                  <div className="quiz-container">
                    <div className="quiz-box">
                      <h1>Fastest Finger First</h1>
                      <Question />
                    </div>
                    <div className="user-list-box">
                      <h2>Topper's List</h2>
                      <UserList username={username} />
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div>
                <Login onLogin={handleLogin} />
              </div>
            )}
          />                
          </Routes>
        </div>
        {isLoggedIn && (<Footer />)}
      </div>
    </Router>
  );
}

export default App;