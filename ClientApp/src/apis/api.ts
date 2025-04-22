// import axios from 'axios';

// const apiClient = axios.create({
//   baseURL: 'https://localhost:7224/api',
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Attach JWT to every request
// apiClient.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('jwt'); // Retrieve JWT from localStorage
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error),
// );

// apiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       console.error('Unauthorized! Logging out...');
//       localStorage.removeItem('jwt');
//       localStorage.removeItem('user');
//       window.location.href = '/login'; // Redirect to login page
//     }
//     return Promise.reject(error);
//   },
// );

// export default apiClient;

// // apiClient.interceptors.request.use(
// //   (config) => {
// //     const jwt = localStorage.getItem('jwt');
// //     if (jwt) {
// //       console.log('JWT Token in header:', jwt); // Logging the JWT
// //       config.headers.Authorization = `Bearer ${jwt}`;
// //     } else {
// //       console.warn('No JWT token found!');
// //     }
// //     console.log('Request Headers:', config.headers); // Log the request headers
// //     return config;
// //   },
// //   (error) => {
// //     return Promise.reject(error);
// //   },
// // );

// // // Response interceptor (Optional: Handle errors globally)
// // apiClient.interceptors.response.use(
// //     (response) => response,
// //     (error) => {
// //       console.error('API Error:', error.response?.data || error.message);
// //       return Promise.reject(error);
// //     },
// //   );
import axios from 'axios';
import { logoutUser, refreshToken } from './auth';

const apiClient = axios.create({
  baseURL: 'https://localhost:7224/api',
  // headers: {
  //   'Content-Type': 'application/json',
  // },
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Attach JWT to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Handle token refresh if expired
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      isRefreshing = true;

      const storedRefreshToken = localStorage.getItem('refreshToken');
      if (!storedRefreshToken) {
        logoutUser();
        return Promise.reject(error);
      }

      try {
        const newToken = await refreshToken(); // gets from raw axios
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        processQueue(null, newToken);
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        logoutUser();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
