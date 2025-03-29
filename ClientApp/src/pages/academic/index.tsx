import FolderList from '@/components/Folder/FolderList';
import Footer from '@/components/Layout/Footer/footer';
import Header from '@/components/Layout/Header/header';
import React from 'react';
import styled from 'styled-components';

const Academic: React.FC = () => {
  return (
    <Container>
      <Header />
      <MainContent>
        <FolderList />
      </MainContent>
      <Footer />
    </Container>
  );
};

export default Academic;

const Container = styled.div`
  background-color: #f8f9fa;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
`;
