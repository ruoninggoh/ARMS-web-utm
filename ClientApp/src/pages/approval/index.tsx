import ApprovalProgress from '@/components/ApprovalProgress/ApprovalProgress';
import FolderList from '@/components/Folder/FolderList';
import Footer from '@/components/Layout/Footer/footer';
import RoleBasedHeader from '@/components/Layout/Header/RoleBasedHeader';
import React from 'react';
import styled from 'styled-components';

const Approval: React.FC = () => {
  const currentApprovalStep = 1; // Example: 0 = sem completed, 1 = HoD, 2 = Deputy Dean, 3 = Dean

  return (
    <Container>
      <RoleBasedHeader />
      <MainContent>
        <ApprovalProgress currentStep={currentApprovalStep} />
        <FolderList />
      </MainContent>
      <Footer />
    </Container>
  );
};
export default Approval;
const Container = styled.div`
  background-color: #f8f9fa;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
`;
