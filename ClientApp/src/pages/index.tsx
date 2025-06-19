// import Title from '@/components/Title';

// export default function Home() {
//   return (
//     <main>
//       <Title>Hello TypeScript!</Title>
//       <p>A TypeScript starter for Gatsby. Great for advanced users.</p>
//       <p>
//         Follow me on Twitter (
//         <a href="https://twitter.com/jpedroschmitz">@jpedroschmitz</a>)
//       </p>
//     </main>
//   );
// }

import { usePageRedirection } from '@/hooks/usePageRedirection';
import FcBackground from '@/images/landing/fcBackground.jpg';
import React from 'react';
import { Col, Container } from 'react-bootstrap';
import styled from 'styled-components';

import FcLogo from '@/images/landing/fcLogo2.png';

const LandingPage: React.FC = () => {
  const redirect = usePageRedirection();
  const handleLogin = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    redirect('login');
  };

  return (
    <LandingWrapper>
      <Overlay>
        <LogoContainer>
          <Logo src={FcLogo} alt="Faculty Logo" />
        </LogoContainer>
        <ContainerWrapper>
          <Container>
            <Col>
              <h1 className="display-4">Academic Resource Management System</h1>
              <h3 className="lead">
                The Faculty of Computing enhances academic resource management
                with a centralized system, simplifying document sharing and
                streamlining administrative tasks.
              </h3>
            </Col>
          </Container>
        </ContainerWrapper>
        <StyledAnchor className="mt-3" onClick={handleLogin} href="#">
          Login
        </StyledAnchor>
      </Overlay>
    </LandingWrapper>
  );
};

export default LandingPage;

const LandingWrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  color: white;
  text-align: center;
  margin: 0;
`;

const Overlay = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  z-index: 1;

  &::before {
    content: '';
    background-image: url(${FcBackground});
    background-size: 120%; // Optional: Zoom in
    background-position: top center;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -2;
  }

  &::after {
    content: '';
    background-color: rgba(0, 0, 0, 0.2);
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
  }
`;
const LogoContainer = styled.div`
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
`;

const ContainerWrapper = styled.div`
  background-color: rgba(0, 0, 0, 0.5); /* 40% black background */
  margin: 0;
  padding-top: 40px;
  padding-bottom: 40px;
  width: 100%; /* Make it cover the full width of the screen */
  border-radius: 5px;
  display: flex;
  justify-content: center; /* Center the content */
  text-align: center;

  /* Make font size bigger */
  h1 {
    font-size: 3rem; /* Increase font size here */
  }
  h3 {
    font-size: 1.5rem; /* Increase font size here */
  }
`;

const Logo = styled.img`
  width: 600px;
  margin-bottom: 20px;
  margin-top: 30px;
  justify-content: center;
`;

const StyledAnchor = styled.a`
  background-color: #5c001f; /* Button background color */
  color: white; /* Button text color */
  font-size: 1.2rem; /* Adjust font size */
  transition: background-color 0.3s ease, transform 0.2s ease;
  margin-top: 20px;
  padding: 10px 40px;
  border-radius: 1rem;
  text-decoration: none;

  &:hover {
    background-color: #4a0018; /* Slightly darker shade for hover */
    transform: scale(1.05); /* Slight grow effect on hover */
  }

  &:focus {
    box-shadow: none; /* Remove the default focus outline */
  }
`;
