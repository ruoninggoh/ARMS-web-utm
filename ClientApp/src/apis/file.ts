import type { AxiosProgressEvent } from 'axios';
import axios from 'axios';
import apiClient from './api';

export const uploadFile = async (
  folderId: number | null,
  file: File,
  onProgress?: (progressEvent: AxiosProgressEvent) => void,
) => {
  // Create a new FormData instance
  const formData = new FormData();

  // Append file with EXACT field name expected by backend
  formData.append('file', file); // lowercase 'file' to match most ASP.NET Core defaults

  // Append folderId if provided
  if (folderId !== null) {
    formData.append('folderId', folderId.toString());
  }

  // Create a new axios instance with no defaults
  const uploadClient = axios.create({
    baseURL: 'https://localhost:7224', // Your API base URL
  });

  // Configuration for the request
  const config = {
    headers: {
      // DO NOT set Content-Type here - let browser set it automatically
    },
    onUploadProgress: onProgress,
    withCredentials: true, // Include if you need authentication
    transformRequest: (data: any, headers: any) => {
      // Remove any default Content-Type header
      if (headers) {
        delete headers['Content-Type'];
      }
      return data;
    },
  };

  try {
    const response = await uploadClient.post(
      '/api/files/upload',
      formData,
      config,
    );
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
