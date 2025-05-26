export interface Folder {
  id: number;
  folderName: string;
  folderPath: string;
  dueDate: string;
  driveFolderId: string;
  lecturerUsername?: string;
  fileSetType?: string | null; // Explicitly allow null
  requiredPrefixesJson?: string | null; // Explicitly allow null
  files: File[];
  subFolders: Folder[];
  lastModified: string;
  parentFolderIds?: number[];
}

export interface CreateFolderRequest {
  folderName: string;
  lecturerUsername?: string;
  parentFolderIds: number[];
  dueDate?: string;
}
