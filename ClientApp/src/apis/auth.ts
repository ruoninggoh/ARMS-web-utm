import apiClient from './api';

// export const loginUser = async (utmId: string, password: string) => {
//   try {
//     const response = await apiClient.post('/Account/login', {
//       utmId,
//       password,
//     });

//     const userData = response.data.data;
//     console.log('Full API Response:', response.data);

//     // Check if the token exists in the API response
//     if (userData && userData.jwToken) {
//       console.log('Storing JWT:', userData.jwToken);
//       localStorage.setItem('jwt', userData.jwToken);
//       localStorage.setItem('refreshToken', userData.refreshToken); // ✅ Add this line
//       localStorage.setItem('user', JSON.stringify(userData));
//     } else {
//       console.error('JWT is missing from API response');
//     }

//     return userData;
//   } catch (error: any) {
//     console.error(
//       'Login error:',
//       error.response?.data?.message || error.message,
//     );
//     throw new Error(error.response?.data?.message || 'Login failed');
//   }
// };
import axios from 'axios';

export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const logoutUser = () => {
  localStorage.removeItem('jwt');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

export const loginUser = async (utmId: string, password: string) => {
  try {
    const response = await apiClient.post('/Account/login', {
      UTMID: utmId,
      Password: password,
    });

    const userData = response.data.data;

    if (userData && userData.jwToken && userData.refreshToken) {
      localStorage.setItem('jwt', userData.jwToken);
      localStorage.setItem('refreshToken', userData.refreshToken);
      localStorage.setItem('user', JSON.stringify(userData));
    } else {
      throw new Error('Authentication failed - no tokens received');
    }

    return userData;
  } catch (error: any) {
    console.error(
      'Login error:',
      error.response?.data?.message || error.message,
    );
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

export const refreshToken = async (): Promise<string> => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) throw new Error('No refresh token found');

  const response = await axios.post(
    'https://localhost:7224/api/account/refresh-token',
    { refreshToken },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  const data = response.data.data;

  // Save new tokens
  localStorage.setItem('jwt', data.jwToken);
  localStorage.setItem('refreshToken', data.refreshToken);
  localStorage.setItem('user', JSON.stringify(data));

  return data.jwToken;
};
