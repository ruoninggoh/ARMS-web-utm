import { User } from '@/types/User/User';
import apiClient from './api';
import { ApiError } from './apiError';

// Fetch all users
export const getAllUsers = async (): Promise<User[]> => {
  try {
    const response = await apiClient.get('/Account/Admin/all-users');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching users:', error);

    throw error;
  }
};

// Fetch a single user by UTMID
export const getUserByUTMID = async (UTMID: string): Promise<User> => {
  try {
    const response = await apiClient.get(`/Account/Admin/user/${UTMID}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

// Update user details
export const updateUser = async (
  UTMID: string,
  updatedUser: Partial<User>,
): Promise<{ success: boolean; error?: any }> => {
  try {
    await apiClient.put(`/Account/Admin/update/${UTMID}`, updatedUser);
    return { success: true };
  } catch (error) {
    console.error('Error updating user:', error);
    return { success: false, error };
  }
};

// Delete user by UTMID
export const deleteUser = async (UTMID: string): Promise<void> => {
  try {
    await apiClient.delete(`/Account/Admin/delete/${UTMID}`); // Adjust the endpoint accordingly
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error; // Re-throw to handle it in the component
  }
};

// Register a new user
export const registerUser = async (
  newUser: Partial<User>,
): Promise<{ success: boolean; message?: string; error?: ApiError }> => {
  try {
    await apiClient.post('/Account/Admin/register', newUser);
    return { success: true, message: 'User registered successfully!' };
  } catch (error: unknown) {
    console.error('Error registering user:', error);
    const apiError = error as ApiError;
    const message =
      apiError.response?.data?.Message || 'Failed to register user';
    return { success: false, message, error: apiError };
  }
};
