import axios from 'axios';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'https://localhost:7224/api';

export const loginUser = async (utmId: string, password: string) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/Account/login`,
      {
        utmId,
        password,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};
