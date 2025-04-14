import { User } from '@/types/User/User';
import apiClient from './api';

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
): Promise<void> => {
  try {
    await apiClient.put(`/Account/Admin/update/${UTMID}`, updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
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
export const registerUser = async (newUser: Partial<User>): Promise<void> => {
  try {
    await apiClient.post('/Account/Admin/register', newUser);
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};
