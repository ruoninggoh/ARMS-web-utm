// import { ApprovalStage } from '@/enums/ApprovalStage';
// import { ApprovalProgressDto } from '@/types/Approval/ApprovalProgressDto';
// import { CheckCircle2 } from 'lucide-react';
// import React from 'react';
// import { ProgressBar, Step } from 'react-step-progress-bar';
// import 'react-step-progress-bar/styles.css';
// import styled, { keyframes } from 'styled-components';

// const stageOrder: ApprovalStage[] = [
//   ApprovalStage.SemesterCompletion,
//   ApprovalStage.HeadOfDepartment,
//   ApprovalStage.DeputyDean,
//   ApprovalStage.Completed,
// ];

// const stageLabels: Record<ApprovalStage, string> = {
//   [ApprovalStage.SemesterCompletion]: 'Completion of Semester',
//   [ApprovalStage.HeadOfDepartment]: 'Head of Department',
//   [ApprovalStage.DeputyDean]: 'Deputy Dean',
//   [ApprovalStage.Completed]: 'Completed',
// };

// const ApprovalProgress: React.FC<{
//   approvalProgress: ApprovalProgressDto;
//   onApprove?: () => void;
//   isLoading?: boolean;
// }> = ({ approvalProgress, onApprove, isLoading = false }) => {
//   const currentStep = stageOrder.indexOf(approvalProgress.currentStage);
//   const progressPercentage = (currentStep / (stageOrder.length - 1)) * 100;

//   const getApproversForStage = (stage: ApprovalStage) => {
//     return approvalProgress.approvers
//       .filter((a) => a.stage === stage)
//       .map((a) => ({
//         name: a.userName,
//         approved: a.hasApproved,
//       }));
//   };

//   return (
//     <Container>
//       <Title>Approval Progress</Title>
//       {isLoading ? (
//         <LoadingIndicator>Loading...</LoadingIndicator>
//       ) : (
//         <ProgressWrapper>
//           <StyledProgressBar
//             percent={progressPercentage}
//             filledBackground="linear-gradient(to right, #4e54c8, #8f94fb)"
//           >
//             {stageOrder.map((stage, index) => {
//               const isCompleted = stageOrder.indexOf(stage) < currentStep;
//               const isCurrent = stageOrder.indexOf(stage) === currentStep;
//               const approvers = getApproversForStage(stage);

//               return (
//                 <Step key={stage}>
//                   {({ accomplished }) => (
//                     <StepWrapper>
//                       <Circle accomplished={accomplished || isCompleted}>
//                         {accomplished || isCompleted ? (
//                           <CheckCircle2 size={16} color="white" />
//                         ) : (
//                           index + 1
//                         )}
//                       </Circle>
//                       <StepLabel>
//                         {stageLabels[stage]}
//                         <ApproversList>
//                           {approvers.map((approver, i) => (
//                             <ApproverItem key={i} approved={approver.approved}>
//                               {approver.name} {approver.approved ? '✓' : '⌛'}
//                             </ApproverItem>
//                           ))}
//                         </ApproversList>
//                         {isCurrent && approvalProgress.canApprove && (
//                           <ApproveButton onClick={onApprove}>
//                             Approve
//                           </ApproveButton>
//                         )}
//                       </StepLabel>
//                     </StepWrapper>
//                   )}
//                 </Step>
//               );
//             })}
//           </StyledProgressBar>
//         </ProgressWrapper>
//       )}
//     </Container>
//   );
// };

// export default ApprovalProgress;

// const Container = styled.div`
//   padding: 3rem 2rem 2rem;
//   max-width: 1000px;
//   margin: 0 auto;
// `;

// const Title = styled.h2`
//   text-align: center;
//   margin-bottom: 7rem;
//   font-size: 30px;
//   color: #333;
// `;

// const ProgressWrapper = styled.div`
//   margin-top: 2rem;
//   margin-bottom: 5rem;
// `;

// const StyledProgressBar = styled(ProgressBar)`
//   height: 8px;
//   border-radius: 5px;
//   width: 100%;
//   transition: width 0.6s ease-in-out;
// `;

// const pulse = keyframes`
//   0% { transform: scale(1); }
//   50% { transform: scale(1.15); }
//   100% { transform: scale(1); }
// `;

// const Circle = styled.div<{ accomplished: boolean }>`
//   width: 34px;
//   height: 34px;
//   border-radius: 50%;
//   background-color: ${({ accomplished }) =>
//     accomplished ? '#4e54c8' : '#e0e0e0'};
//   border: 3px solid ${({ accomplished }) => (accomplished ? '#4e54c8' : '#ccc')};
//   color: ${({ accomplished }) => (accomplished ? '#fff' : '#555')};
//   font-weight: bold;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   animation: ${({ accomplished }) => (accomplished ? pulse : 'none')} 0.4s
//     ease-in-out;
//   transition: all 0.3s ease;
//   z-index: 2;
// `;

// const StepWrapper = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   margin-top: -20px;
// `;

// const StepLabel = styled.div`
//   margin-top: 35px;
//   font-size: 16px;
//   text-align: center;
//   color: #444;
//   line-height: 1.4;
//   min-width: 150px;
// `;

// const ApproveButton = styled.button`
//   margin-top: 10px;
//   padding: 5px 15px;
//   background-color: #4e54c8;
//   color: white;
//   border: none;
//   border-radius: 4px;
//   cursor: pointer;
//   font-size: 14px;
//   transition: background-color 0.3s;

//   &:hover {
//     background-color: #3a3f9e;
//   }

//   &:disabled {
//     background-color: #cccccc;
//     cursor: not-allowed;
//   }
// `;
// const ApproversList = styled.div`
//   margin-top: 8px;
//   display: flex;
//   flex-direction: column;
//   gap: 4px;
// `;

// const ApproverItem = styled.div<{ approved: boolean }>`
//   font-size: 12px;
//   color: ${({ approved }) => (approved ? '#4CAF50' : '#FF9800')};
//   display: flex;
//   align-items: center;
//   gap: 4px;
// `;

// const LoadingIndicator = styled.div`
//   text-align: center;
//   padding: 2rem;
//   font-size: 16px;
//   color: #666;
// `;

import { ApprovalStage } from '@/enums/ApprovalStage';
import { ApprovalProgressDto } from '@/types/Approval/ApprovalProgressDto';
import { CheckCircle2, Clock, User } from 'lucide-react';
import React from 'react';
import { ProgressBar, Step } from 'react-step-progress-bar';
import 'react-step-progress-bar/styles.css';
import styled, { keyframes } from 'styled-components';

const stageOrder: ApprovalStage[] = [
  ApprovalStage.SemesterCompletion,
  ApprovalStage.HeadOfDepartment,
  ApprovalStage.DeputyDean,
  ApprovalStage.Completed,
];

const stageLabels: Record<ApprovalStage, string> = {
  [ApprovalStage.SemesterCompletion]: 'Semester Completion',
  [ApprovalStage.HeadOfDepartment]: 'Head of Department',
  [ApprovalStage.DeputyDean]: 'Deputy Dean',
  [ApprovalStage.Completed]: 'Completed',
};

const ApprovalProgress: React.FC<{
  approvalProgress: ApprovalProgressDto;
  onApprove?: () => void;
  isLoading?: boolean;
}> = ({ approvalProgress, onApprove, isLoading = false }) => {
  const currentStep = stageOrder.indexOf(approvalProgress.currentStage);
  const progressPercentage = (currentStep / (stageOrder.length - 1)) * 100;

  const getApproversForStage = (stage: ApprovalStage) => {
    return approvalProgress.approvers
      .filter((a) => a.stage === stage)
      .map((a) => ({
        name: a.userName || a.userId,
        approved: a.hasApproved,
        date: a.approvedDate,
      }));
  };

  return (
    <Container>
      <Title>Approval Workflow</Title>
      {isLoading ? (
        <LoadingIndicator>
          <Spinner />
          <span>Loading approval status...</span>
        </LoadingIndicator>
      ) : (
        <>
          {/* Progress Bar with Indicators */}
          <ProgressBarContainer>
            <StyledProgressBar
              percent={progressPercentage}
              filledBackground="linear-gradient(to right, #4f46e5, #7c3aed)"
            >
              {stageOrder.map((stage, index) => (
                <Step key={stage}>
                  {({ accomplished }) => (
                    <ProgressIndicator>
                      <ProgressDot accomplished={accomplished}>
                        {accomplished ? (
                          <CheckCircle2 size={16} color="white" />
                        ) : (
                          index + 1
                        )}
                      </ProgressDot>
                    </ProgressIndicator>
                  )}
                </Step>
              ))}
            </StyledProgressBar>
          </ProgressBarContainer>

          {/* Stages Container */}
          <StagesGrid>
            {stageOrder.map((stage) => {
              const isCurrent = stage === approvalProgress.currentStage;
              const isCompleted = stageOrder.indexOf(stage) < currentStep;
              const approvers = getApproversForStage(stage);

              return (
                <StageCard
                  key={stage}
                  active={isCurrent}
                  completed={isCompleted}
                >
                  <StageHeader>
                    <StageTitle>{stageLabels[stage]}</StageTitle>
                    <StageStatus
                      completed={
                        isCompleted ||
                        (isCurrent && approvalProgress.isCompleted)
                      }
                    >
                      {isCompleted ||
                      (isCurrent && approvalProgress.isCompleted)
                        ? 'Completed'
                        : isCurrent
                        ? 'In Progress'
                        : 'Pending'}
                    </StageStatus>
                  </StageHeader>

                  <ApproversContainer>
                    {approvers.length > 0 ? (
                      approvers.map((approver) => (
                        <ApproverRow
                          key={approver.name}
                          approved={approver.approved}
                        >
                          <UserIcon size={14} />
                          <ApproverDetails>
                            <ApproverName>{approver.name}</ApproverName>
                            <ApprovalStatus approved={approver.approved}>
                              {approver.approved ? (
                                <>
                                  <ApprovedIcon size={14} />
                                  <span>
                                    Approved{' '}
                                    {approver.date &&
                                      new Date(
                                        approver.date,
                                      ).toLocaleDateString()}
                                  </span>
                                </>
                              ) : (
                                <>
                                  <PendingIcon size={14} />
                                  <span>Pending Approval</span>
                                </>
                              )}
                            </ApprovalStatus>
                          </ApproverDetails>
                        </ApproverRow>
                      ))
                    ) : (
                      <NoApprovers>No approvers assigned</NoApprovers>
                    )}
                  </ApproversContainer>

                  {isCurrent && approvalProgress.canApprove && (
                    <ApproveButton onClick={onApprove}>
                      Approve This Stage
                    </ApproveButton>
                  )}
                </StageCard>
              );
            })}
          </StagesGrid>
        </>
      )}
    </Container>
  );
};

export default ApprovalProgress;

// Styled Components
const Container = styled.div`
  padding: 2rem;
  max-width: 1600px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a1a1a;
`;

const ProgressBarContainer = styled.div`
  margin: 2rem 0 3rem;
  padding: 0 1rem;
`;

const StyledProgressBar = styled(ProgressBar)`
  height: 6px;
  border-radius: 3px;
  width: 100%;
  background-color: #f0f0f0;
`;

const ProgressIndicator = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const ProgressDot = styled.div<{ accomplished: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${({ accomplished }) => (accomplished ? '#4f46e5' : '#f3f4f6')};
  border: 2px solid
    ${({ accomplished }) => (accomplished ? '#4f46e5' : '#d1d5db')};
  color: ${({ accomplished }) => (accomplished ? 'white' : '#6b7280')};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  margin-top: -13px;
  transition: all 0.3s ease;
`;

const StagesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
`;

const StageCard = styled.div<{ active: boolean; completed: boolean }>`
  padding: 1.25rem;
  border-radius: 8px;
  background: white;
  border: 1px solid
    ${({ active, completed }) =>
      active ? '#e0e7ff' : completed ? '#e5f6ed' : '#f0f0f0'};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease;

  ${({ active }) =>
    active &&
    `
    border-left: 4px solid #4f46e5;
    background-color: #f8faff;
  `}

  ${({ completed }) =>
    completed &&
    `
    border-left: 4px solid #10b981;
  `}
`;

const StageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #f0f0f0;
`;

const StageTitle = styled.h3`
  font-size: 0.95rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
`;

const StageStatus = styled.span<{ completed: boolean }>`
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  background: ${({ completed }) => (completed ? '#e5f6ed' : '#fff4e6')};
  color: ${({ completed }) => (completed ? '#10b981' : '#f59e0b')};
`;

const ApproversContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ApproverRow = styled.div<{ approved: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: ${({ approved }) => (approved ? '#f0fdf4' : '#fff8f1')};
  border-radius: 6px;
`;

const UserIcon = styled(User)`
  color: #6b7280;
  flex-shrink: 0;
`;

const ApproverDetails = styled.div`
  flex: 1;
  min-width: 0;
`;

const ApproverName = styled.div`
  font-size: 0.85rem;
  font-weight: 500;
  color: #1a1a1a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ApprovalStatus = styled.div<{ approved: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.75rem;
  color: ${({ approved }) => (approved ? '#10b981' : '#f59e0b')};
  margin-top: 0.15rem;
`;

const ApprovedIcon = styled(CheckCircle2)`
  stroke-width: 2.5;
`;

const PendingIcon = styled(Clock)`
  stroke-width: 2.5;
`;

const NoApprovers = styled.div`
  font-size: 0.85rem;
  color: #9ca3af;
  text-align: center;
  padding: 0.5rem;
`;

const ApproveButton = styled.button`
  width: 100%;
  margin-top: 1rem;
  padding: 0.65rem;
  background-color: #4f46e5;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #4338ca;
  }

  &:disabled {
    background-color: #e5e7eb;
    cursor: not-allowed;
  }
`;

const LoadingIndicator = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
  color: #6b7280;
  font-size: 0.875rem;
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Spinner = styled.div`
  width: 24px;
  height: 24px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: #4f46e5;
  animation: ${spin} 1s ease-in-out infinite;
`;
