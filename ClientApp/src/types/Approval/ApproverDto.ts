import { ApprovalStage } from '@/enums/ApprovalStage';

export interface ApproverDto {
  userId: string;
  userName: string;
  stage: ApprovalStage;
  hasApproved: boolean;
  approvedDate?: string;
}
