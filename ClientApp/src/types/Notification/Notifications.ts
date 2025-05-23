export interface Notifications {
  id: number;
  message: string;
  isRead: boolean;
  created: string;
  folderId?: number;
  folderName?: string;
  type: 'comment' | 'dueDate';
}
