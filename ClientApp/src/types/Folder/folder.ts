export interface Folder {
  id: number;
  folderName: string;
  folderPath: string;
  dueDate: string;
  driveFolderId: string;
  lecturerUsername?: string; // Add this
  files: File[];
  subFolders: Folder[];
  lastModified: string; // Add this from AuditableBaseEntity
  parentFolderIds?: number[];
}

export interface CreateFolderRequest {
  folderName: string;
  lecturerUsername?: string;
  parentFolderIds: number[];
  dueDate?: string;
}
