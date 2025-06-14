import { ApprovalProgressDto } from '@/types/Approval/ApprovalProgressDto';
import { CreateApprovalProgressRequest } from '@/types/Approval/CreateApprovalProgressRequest';
import { UpdateApprovalProgressRequest } from '@/types/Approval/UpdateApprovalProgressRequest';
import apiClient from './api';

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
