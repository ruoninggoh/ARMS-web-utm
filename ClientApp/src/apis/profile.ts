import apiClient from './api';

export const fetchUserProfile = async () => {
  try {
    const response = await apiClient.get('/Account/User/profile');
    return response.data.data;
  } catch (error: any) {
    console.error(
      'Error fetching profile:',
      error.response?.data?.message || error.message,
    );
    throw new Error(error.response?.data?.message || 'Failed to fetch profile');
  }
};

export const updateUserProfile = async (updatedProfile: any) => {
  try {
    console.log('Updated Profile Payload:', updatedProfile); // Debugging

    const response = await apiClient.put(
      '/Account/User/update-profile',
      updatedProfile,
    );

    return response.data;
  } catch (error: any) {
    console.error(
      'Error updating profile:',
      error.response?.data?.message || error.message,
    );

    console.error('API Validation Errors:', error.response?.data?.errors); // Debugging

    throw new Error(
      error.response?.data?.message || 'Failed to update profile',
    );
  }
};
