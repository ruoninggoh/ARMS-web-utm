export interface CreateApprovalProgressRequest {
  folderId: number;
  semesterCompletionDate?: string;
  headOfDepartmentIds: string[];
  deputyDeanIds: string[];
}
