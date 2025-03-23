import axios from 'axios';

const API_PATH = import.meta.env.VITE_API_PATH || '/api';

const axiosInstance = axios.create({
  baseURL: API_PATH,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add timestamp to help prevent caching
    config.params = {
      ...config.params,
      _t: Date.now()
    };
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Handle common error scenarios
    const errorMessage = error.response?.data?.error || error.message || 'An unexpected error occurred';
    console.error('API Error:', errorMessage);
    return Promise.reject(new Error(errorMessage));
  }
);

export default axiosInstance;