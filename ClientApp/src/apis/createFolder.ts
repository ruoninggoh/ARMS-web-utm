// apiService.ts
import axios from 'axios';

const API_BASE_URL = 'https://localhost:44377/api/GoogleDrive';

export const createFolder = async (folderName: string) => {
  const response = await axios.post(
    `${API_BASE_URL}/create-folder`,
    folderName,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  return response.data;
};
