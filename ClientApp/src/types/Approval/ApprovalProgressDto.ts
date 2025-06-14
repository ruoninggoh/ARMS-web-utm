import { ApprovalStage } from '@/enums/ApprovalStage';
import { ApproverDto } from './ApproverDto';

export interface ApprovalProgressDto {
  folderId: number;
  folderName: string;
  semesterCompletionDate?: string;
  isSemesterCompleted: boolean;
  currentStage: ApprovalStage;
  isCompleted: boolean;
  completedDate?: string;
  canApprove: boolean;
  approvers: ApproverDto[];
}
