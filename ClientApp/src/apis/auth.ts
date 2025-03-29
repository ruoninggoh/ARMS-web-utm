import apiClient from './api';

// Function to log in the user
export const loginUser = async (utmId: string, password: string) => {
  try {
    const response = await apiClient.post('/Account/login', {
      utmId,
      password,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};
