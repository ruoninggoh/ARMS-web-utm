import { ApprovalProgressDto } from '@/types/Approval/ApprovalProgressDto';
import { CreateApprovalProgressRequest } from '@/types/Approval/CreateApprovalProgressRequest';
import { UpdateApprovalProgressRequest } from '@/types/Approval/UpdateApprovalProgressRequest';
import apiClient from './api';
import { User } from '@/types/User/User';

export const getApprovalProgress = async (
  folderId: number,
): Promise<ApprovalProgressDto> => {
  const response = await apiClient.get(`/approval/${folderId}`);
  return response.data;
};

export const createApprovalProgress = async (
  data: CreateApprovalProgressRequest,
): Promise<ApprovalProgressDto> => {
  const response = await apiClient.post('/approval/create', {
    ...data,
    headOfDepartmentUsernames: data.headOfDepartmentIds,
    deputyDeanUsernames: data.deputyDeanIds,
  });
  return response.data;
};

export const updateApprovalProgress = async (
  data: UpdateApprovalProgressRequest,
): Promise<ApprovalProgressDto> => {
  const response = await apiClient.put('/approval/update', {
    ...data,
    headOfDepartmentUsernames: data.headOfDepartmentIds,
    deputyDeanUsernames: data.deputyDeanIds,
  });
  return response.data;
};

export const approveStage = async (folderId: number): Promise<boolean> => {
  const response = await apiClient.post('/approval/approve', { folderId });
  return response.data;
};

export const getDeputyDeans = async (): Promise<User[]> => {
  try {
    const response = await apiClient.get('/Account/users/deputy-deans');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching deputy deans:', error);
    throw error;
  }
};

export const getHeadsOfDepartment = async (): Promise<User[]> => {
  try {
    const response = await apiClient.get('/Account/users/head-of-departments');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching heads of department:', error);
    throw error;
  }
};
