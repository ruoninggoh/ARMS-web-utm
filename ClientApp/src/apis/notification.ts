import { Notifications } from '@/types/Notification/Notifications';
import apiClient from './api';

export const getUserNotifications = async (): Promise<Notifications[]> => {
  const response = await apiClient.get('/notification');
  return response.data;
};

export const markNotificationAsRead = async (
  notificationId: number,
): Promise<void> => {
  await apiClient.post(`/notification/${notificationId}/mark-read`);
};

export const getUnreadNotificationCount = async (): Promise<number> => {
  const response = await apiClient.get('/notification/unread-count');
  return response.data.unreadCount || response.data.UnreadCount || 0;
};
