export interface UploadFileResponse {
  id: number;
  fileName: string;
  fileSize: string;
  mimeType: string;
  created: string;
  thumbnailUrl?: string;
}
