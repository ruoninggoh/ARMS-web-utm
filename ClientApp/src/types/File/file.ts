// Update your File type definition
export interface File {
  id: number;
  fileName: string;
  originalFileName: string;
  filePath: string;
  driveFileId: string;
  mimeType: string;
  fileSize: number;
  created: string;
  lastModified: string;
  thumbnailUrl: string | null;
  webViewLink: string | null;
  createdByUsername: string | null;
  lastModifiedByUsername: string | null;
}
