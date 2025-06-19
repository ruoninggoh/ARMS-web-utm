import { loginUser } from '@/apis/auth';
import { usePageRedirection } from '@/hooks/usePageRedirection';
import FcBackground from '@/images/landing/fcBackground.jpg';
import FcLogo from '@/images/landing/fcLogo2.png';
import React, { useState } from 'react';
import { Button, Col, Form } from 'react-bootstrap';
import styled from 'styled-components';

const FormPage: React.FC = () => {
  const redirect = usePageRedirection();
  const [utmId, setUtmid] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Reset error

    try {
      const response = await loginUser(utmId, password);
      console.log('Login successful:', response);
      redirect('academic'); // Redirect on success
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Please try again.');
    }
  };

  return (
    <LandingWrapper>
      <Overlay>
        <FormContainer>
          <LogoContainer>
            <Logo src={FcLogo} alt="Faculty Logo" />
          </LogoContainer>
          <ContentWrapper>
            <SignUpWrapper>
              <h1 className="mb-4">Sign In</h1>
            </SignUpWrapper>

            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formBasicUtmid">
                <StyledLabel>UTMID:</StyledLabel>
                <StyledControl
                  type="text"
                  placeholder="Enter UTMID"
                  value={utmId}
                  onChange={(e) => setUtmid(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId="formBasicPassword">
                <StyledLabel>Password:</StyledLabel>
                <StyledControl
                  type="password"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>

              {error && <ErrorText>{error}</ErrorText>}

              <LoginButton type="submit">Login</LoginButton>
            </Form>
          </ContentWrapper>
        </FormContainer>
      </Overlay>
    </LandingWrapper>
  );
};

export default FormPage;

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

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 400px;
`;

const LogoContainer = styled.div`
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
`;

const Logo = styled.img`
  width: 400px;
  margin-bottom: 20px;
  margin-top: 30px;
  justify-content: center;
`;

const ContentWrapper = styled(Col)`
  padding: 40px 30px;
  border-radius: 8px;
  width: 150%;
  max-width: 500px;
  background-color: rgba(13, 12, 12, 0.45);
  display: block;
`;

const StyledLabel = styled(Form.Label)`
  display: block;
  font-size: 1rem;
  font-weight: bold;
  text-align: left;
  margin-bottom: 0.5rem;
`;

const StyledControl = styled(Form.Control)`
  width: 100%;
  padding: 10px 6px;
  border: 2px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
  margin-bottom: 1.5rem;
`;

const LoginButton = styled(Button)`
  width: 100%;
  background-color: #5c001f;
  border: none;
  padding: 10px 0;
  font-size: 1.2rem;
  transition: background-color 0.3s ease, transform 0.2s ease;
  margin-top: 20px;

  &:hover {
    background-color: #4a0018;
    transform: scale(1.05);
  }
`;

const ErrorText = styled.p`
  color: red;
  font-size: 0.9rem;
  margin-top: 5px;
  text-align: center;
`;

const SignUpWrapper = styled.div`
  margin-top: 10px;
  text-align: center;

  p {
    margin: 0;
    color: white;
  }
`;
