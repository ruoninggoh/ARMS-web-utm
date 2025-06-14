export interface UpdateApprovalProgressRequest {
  folderId: number;
  semesterCompletionDate?: string;
  headOfDepartmentIds: string[];
  deputyDeanIds: string[];
}
