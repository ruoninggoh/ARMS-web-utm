import axios from 'axios';
import apiClient from './api';

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

      // Store the complete user object including roles
      const userWithRoles = {
        ...userData,
        roles: userData.roles || [], // Ensure roles array exists
      };
      localStorage.setItem('user', JSON.stringify(userData));

      return userWithRoles;
    } else {
      throw new Error('Authentication failed - no tokens received');
    }
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
