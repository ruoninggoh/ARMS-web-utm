import { FilePrefixDto } from '@/types/FileSet/FilePrefixDto';
import { FileSetDto } from '@/types/FileSet/FileSetDto';
import { Folder } from '@/types/Folder/folder';
import { AssigneeOption } from '@/types/User/AssigneeOption';
import { User } from '@/types/User/User';
import apiClient from './api';

export const getNestedFolders = async (
  parentId?: number,
): Promise<Folder[]> => {
  const params = parentId ? { parentFolderId: parentId } : {};
  const response = await apiClient.get('/Folders/nested', { params });

  return response.data.map((folder: any) => ({
    ...folder,
    lecturerUsername: folder.lecturerUsername,
    lastModified: folder.lastModified || new Date().toISOString(),
    // Ensure status properties are included with defaults
    hasRequirements: folder.hasRequirements || false,
    hasDirectRequirements: folder.hasDirectRequirements || false,
    totalRequired: folder.totalRequired || 0,
    uploadedCount: folder.uploadedCount || 0,
    statusMessage: folder.statusMessage || folder.message, // handles both response formats
    statusItems: folder.statusItems || [],
    missingPrefixes: folder.missingPrefixes || [],
    completionPercentage: folder.completionPercentage || 0,
  }));
};

export const createFolder = async (data: {
  folderName: string;
  lecturerUsername?: string;
  parentFolderIds: number[]; // Now properly handled as array
  dueDate?: string | null;
  fileSetType?: string;
  requiredPrefixes?: FilePrefixDto[];
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
  fileSetType?: string;
  requiredPrefixes?: FilePrefixDto[];
}): Promise<Folder> => {
  try {
    const response = await apiClient.put(`/Folders/${data.id}`, {
      folderName: data.folderName,
      lecturerUsername: data.lecturerUsername,
      dueDate: data.dueDate,
      parentFolderIds: data.parentFolderIds || [],
      fileSetType: data.fileSetType,
      requiredPrefixes: data.requiredPrefixes,
    });
    return response.data;
  } catch (error: any) {
    // Throw the error message from backend or a default message
    throw new Error(error.response?.data?.message || 'Failed to update folder');
  }
};

export const deleteFolder = async (
  folderId: number,
): Promise<{ Message: string }> => {
  const response = await apiClient.delete(`/Folders/${folderId}`);
  return response.data;
};

export const getTopLevelFolders = async (): Promise<any[]> => {
  const response = await apiClient.get('/folders/top-level');
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

// export const getAssigneeUser = async (): Promise<User[]> => {
export const getAssigneeUser = async (): Promise<AssigneeOption[]> => {
  try {
    const response = await apiClient.get('/Account/assignable-users');
    console.log('API Response:', response.data); // Debug log

    // Transform the API response to match expected structure
    return response.data.data.map(
      (user: User): AssigneeOption => ({
        id: user.utmid, // mapping from User
        name: user.userName || user.email,
      }),
    );
  } catch (error) {
    console.error('Error fetching non-admin users:', error);
    throw error;
  }
};

export const getFileSets = async (): Promise<FileSetDto[]> => {
  const response = await apiClient.get('/Folders/file-sets');
  return response.data;
};

export const getFileSetRequirements = async (
  key: string,
): Promise<FilePrefixDto[]> => {
  const response = await apiClient.get(`Folders/file-sets/${key}/requirements`);
  return response.data;
};
