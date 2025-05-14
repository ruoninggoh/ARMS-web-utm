import { Folder } from '@/types/Folder/folder';
import { User } from '@/types/User/User';
import apiClient from './api';

export const getNestedFolders = async (
  parentId?: number,
): Promise<Folder[]> => {
  const params = parentId ? { parentFolderId: parentId } : {};
  const response = await apiClient.get('/Folders/nested', { params });
  return response.data.map((folder: any) => ({
    ...folder,
    lecturerUsername: folder.lecturerUsername, // Ensure this is included
    lastModified: folder.lastModified || new Date().toISOString(), // Fallback if not provided
  }));
};

export const createFolder = async (data: {
  folderName: string;
  lecturerUsername?: string;
  parentFolderIds: number[]; // Now properly handled as array
  dueDate?: string | null;
}): Promise<Folder> => {
  console.log('Sending to API:', data);

  // Ensure empty array is sent instead of undefined
  const payload = {
    ...data,
    lecturerUsername: data.lecturerUsername || null,
    parentFolderIds: data.parentFolderIds || [],
  };

  const response = await apiClient.post('/Folders/createFolder', payload);
  return response.data;
};

export const editFolder = async (data: {
  id: number;
  folderName: string;
  lecturerUsername?: string;
  dueDate?: string | null;
  parentFolderIds?: number[];
}): Promise<Folder> => {
  const response = await apiClient.put(`/Folders/${data.id}`, {
    folderName: data.folderName,
    lecturerUsername: data.lecturerUsername,
    dueDate: data.dueDate,
    parentFolderIds: data.parentFolderIds || [],
  });
  return response.data;
};

export const deleteFolder = async (
  folderId: number,
): Promise<{ Message: string }> => {
  const response = await apiClient.delete(`/Folders/${folderId}`);
  return response.data;
};

export const getAssigneeList = async (): Promise<User[]> => {
  try {
    const response = await apiClient.get('/Account/assignable-users');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching non-admin users:', error);
    throw error;
  }
};
