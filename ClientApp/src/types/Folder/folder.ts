export interface Folder {
  id: number;
  folderName: string;
  folderPath: string;
  dueDate: string;
  driveFolderId: string;
  files: File[];
  subFolders: Folder[];
  lastModified: string; // Add this from AuditableBaseEntity
}

export interface CreateFolderRequest {
  folderName: string;
  lecturerUsername?: string;
  parentFolderIds: number[];
  dueDate?: string;
}
