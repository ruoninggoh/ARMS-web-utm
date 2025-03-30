import apiClient from './api';

export const loginUser = async (utmId: string, password: string) => {
  try {
    const response = await apiClient.post('/Account/login', {
      utmId,
      password,
    });

    const userData = response.data.data;
    console.log('Full API Response:', response.data);

    // Check if the token exists in the API response
    if (userData && userData.jwToken) {
      console.log('Storing JWT:', userData.jwToken);
      localStorage.setItem('jwt', userData.jwToken);
      localStorage.setItem('user', JSON.stringify(userData));
    } else {
      console.error('JWT is missing from API response');
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

export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const logoutUser = () => {
  localStorage.removeItem('jwt');
  localStorage.removeItem('user');

  console.log(' JWT after logout:', localStorage.getItem('jwt')); // Should be null
  console.log('User data after logout:', localStorage.getItem('user')); // Should be null
  alert('You have been logged out');
};
