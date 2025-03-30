import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://localhost:7224/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      console.log('JWT Token in header:', jwt); // Logging the JWT
      config.headers.Authorization = `Bearer ${jwt}`;
    } else {
      console.warn('No JWT token found!');
    }
    console.log('Request Headers:', config.headers); // Log the request headers
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
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
