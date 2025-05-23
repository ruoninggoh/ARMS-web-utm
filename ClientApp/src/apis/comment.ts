import { CommentDto } from '@/types/Comment/Comment';
import { CreateCommentDto } from '@/types/Comment/CreateCommentDto';
import apiClient from './api';

export const getCommentsByFolder = async (
  folderId: number,
): Promise<CommentDto[]> => {
  const response = await apiClient.get(`/comments/${folderId}`);
  return response.data;
};

export const createComment = async (
  data: CreateCommentDto,
): Promise<CommentDto> => {
  const response = await apiClient.post('/comments', data);
  return response.data;
};
