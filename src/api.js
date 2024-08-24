import axios from 'axios';

// Function to get the auth token from local storage
export const getAuthToken = () => {
  return window.localStorage.getItem('accessToken');
};

// Set Axios defaults
axios.defaults.baseURL = 'https://quick-order-quiz.onrender.com';
axios.defaults.headers.post['Content-Type'] = 'application/json';

// Centralized request function
export const request = (method, url, data = {}) => {
  let headers = {};
  const token = getAuthToken();
  if (token && token !== "null") {
    headers = { 'Authorization': `Bearer ${token}` };
  }

  return axios({
    method: method,
    url: url,
    headers: headers,
    data: data
  });
};
