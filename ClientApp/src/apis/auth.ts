// const API_BASE_URL = 'https://localhost:44377/api/Account';

// interface LoginResponse {
//   token: string;
//   refreshToken?: string;
//   expiresIn?: number;
//   user: {
//     id: string;
//     name: string;
//     utmId: string;
//   };
// }

// export const login = async (
//   utmId: string,
//   password: string,
// ): Promise<LoginResponse> => {
//   try {
//     const response = await axios.post<LoginResponse>(
//       `${API_BASE_URL}/login`,
//       { utmId, password },
//       {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       },
//     );

//     return response.data;
//   } catch (error: any) {
//     throw new Error(error.response?.data?.message || 'Login failed');
//   }
// };
import axios from 'axios';

const BFF_URL = 'https://localhost:7252'; // BFF URL

export const loginUser = async (utmId: string, password: string) => {
  try {
    const response = await axios.post(`${BFF_URL}/api/auth/login`, {
      utmId,
      password,
    });

    return response.data;
  } catch (error: any) {
    console.error('Login error:', error.response?.data);
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};
