export interface StatusItem {
  prefix: string;
  displayName: string;
  example: string;
  isUploaded: boolean;
}

// Update your Folder interface to include status properties
export interface Folder {
  id: number;
  folderName: string;
  folderPath: string;
  dueDate: string;
  driveFolderId: string;
  lecturerUsername?: string;
  fileSetType?: string | null;
  requiredPrefixesJson?: string | null;
  files: File[];
  subFolders: Folder[];
  lastModified: string;
  parentFolderIds?: number[];

  // Add these status properties
  hasRequirements: boolean;
  hasDirectRequirements: boolean;
  totalRequired: number;
  uploadedCount: number;
  statusMessage?: string;
  statusItems?: StatusItem[];
  missingPrefixes?: string[];
  completionPercentage: number;
}

// Remove FolderStatus and FolderWithStatus interfaces as they're no longer needed

export interface CreateFolderRequest {
  folderName: string;
  lecturerUsername?: string;
  parentFolderIds: number[];
  dueDate?: string;
  fileSetType?: string | null;
  requiredPrefixesJson?: string | null;
}
