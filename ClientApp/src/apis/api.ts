import axios from 'axios';

// Create an Axios instance with the base URL
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://localhost:7224/api', // Use env variable or fallback
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor (Optional: Add authentication token here if needed)
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Get token from local storage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor (Optional: Handle errors globally)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  },
);

export default apiClient;
