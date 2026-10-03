import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor to return humanized error messages
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'An error occurred. Please try again.';
    if (error.response && error.response.data) {
      if (typeof error.response.data === 'string') {
        message = error.response.data;
      } else if (error.response.data.message) {
        message = error.response.data.message;
      }
    } else if (error.request) {
      message = 'Cannot connect to backend server. Make sure Spring Boot is running on port 8080.';
    }
    return Promise.reject(new Error(message));
  }
);

export default api;
