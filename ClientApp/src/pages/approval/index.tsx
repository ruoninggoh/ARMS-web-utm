// src/pages/approval.tsx
import ApprovalManagement from '@/components/Approval/ApprovalManagement';
import Footer from '@/components/Layout/Footer/footer';
import RoleBasedHeader from '@/components/Layout/Header/RoleBasedHeader';
import React from 'react';
import styled from 'styled-components';

const Approval: React.FC = () => {
  return (
    <Container>
      <RoleBasedHeader />
      <MainContent>
        <ApprovalManagement />
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
  padding: 2rem 0;
`;
