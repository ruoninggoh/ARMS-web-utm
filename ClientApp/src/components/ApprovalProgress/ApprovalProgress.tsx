import { CheckCircle2 } from 'lucide-react';
import React from 'react';
import { ProgressBar, Step } from 'react-step-progress-bar';
import 'react-step-progress-bar/styles.css';
import styled, { keyframes } from 'styled-components';

type Props = {
  currentStep: number; // 0 = sem, 1 = HoD, 2 = Deputy Dean, 3 = Dean
};

const steps = [
  'Completion of Semester',
  'Head of Department',
  'Deputy Dean',
  'Dean',
];

const ApprovalProgress: React.FC<Props> = ({ currentStep }) => {
  const progressPercentage = (currentStep / (steps.length - 1)) * 100;

  return (
    <Container>
      <Title>Approval Progress</Title>
      <ProgressWrapper>
        <StyledProgressBar
          percent={progressPercentage}
          filledBackground="linear-gradient(to right, #4e54c8, #8f94fb)"
        >
          {steps.map((label, index) => (
            <Step key={index}>
              {({ accomplished }) => (
                <StepWrapper>
                  <Circle accomplished={accomplished}>
                    {accomplished ? (
                      <CheckCircle2 size={16} color="white" />
                    ) : (
                      index + 1
                    )}
                  </Circle>
                  <StepLabel>{label}</StepLabel>
                </StepWrapper>
              )}
            </Step>
          ))}
        </StyledProgressBar>
      </ProgressWrapper>
    </Container>
  );
};

export default ApprovalProgress;

const Container = styled.div`
  padding: 3rem 2rem 2rem;
  max-width: 1000px;
  margin: 0 auto;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 7rem;
  font-size: 30px;
  color: #333;
`;

const ProgressWrapper = styled.div`
  margin-top: 2rem;
  margin-bottom: 5rem;
`;

const StyledProgressBar = styled(ProgressBar)`
  height: 8px;
  border-radius: 5px;
  width: 100%;
  transition: width 0.6s ease-in-out;
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.15); }
  100% { transform: scale(1); }
`;

const Circle = styled.div<{ accomplished: boolean }>`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background-color: ${({ accomplished }) =>
    accomplished ? '#4e54c8' : '#e0e0e0'};
  border: 3px solid ${({ accomplished }) => (accomplished ? '#4e54c8' : '#ccc')};
  color: ${({ accomplished }) => (accomplished ? '#fff' : '#555')};
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${({ accomplished }) => (accomplished ? pulse : 'none')} 0.4s
    ease-in-out;
  transition: all 0.3s ease;
  z-index: 2;
`;

const StepWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: -20px; /* Raise the circle above the line */
`;

const StepLabel = styled.div`
  margin-top: 35px;
  font-size: 16px;
  text-align: center;
  color: #444;
  line-height: 1.4;
`;
