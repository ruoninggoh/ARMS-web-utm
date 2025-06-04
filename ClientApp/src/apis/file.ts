import type { AxiosProgressEvent } from 'axios';
import apiClient from './api';

export const uploadFile = async (
  folderId: number | null,
  file: File,
  onProgress?: (progressEvent: AxiosProgressEvent) => void,
) => {
  const formData = new FormData();
  formData.append('file', file);

  if (folderId !== null) {
    formData.append('folderId', folderId.toString());
  }

  try {
    const response = await apiClient.post('/files/upload', formData, {
      headers: {
        // Don't set Content-Type; browser will set it for FormData
      },
      onUploadProgress: onProgress,
      transformRequest: (data: any, headers: any) => {
        if (headers) {
          delete headers['Content-Type'];
        }
        return data;
      },
    });

    return response.data;
  } catch (error: any) {
    console.error('Upload failed. Details:', {
      request: {
        headers: error.config?.headers,
        data: error.config?.data,
        url: error.config?.url,
      },
      response: {
        status: error.response?.status,
        data: error.response?.data,
      },
    });
    throw error;
  }
};

export const deleteFile = async (fileId: number) => {
  await apiClient.delete(`/Files/${fileId}`);
};

export const updateFileName = async (fileId: number, newName: string) => {
  const response = await apiClient.put(
    `/files/${fileId}`,
    { newName },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  return response.data;
};

export const downloadFile = async (fileId: number): Promise<Blob> => {
  try {
    const response = await apiClient.get(`/files/download/${fileId}`, {
      responseType: 'blob', // Crucial for file downloads
    });

    console.log('File response size:', response.data.size); // Log the size for debugging

    if (response.data.size === 0) {
      throw new Error('Received empty file content');
    }

    return response.data;
  } catch (error: any) {
    console.error('Download failed:', {
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error;
  }
};

export const getFilesByFolder = async (folderId: number) => {
  const response = await apiClient.get(`/files/by-folder/${folderId}`);
  return response.data;
};
