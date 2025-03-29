import FcLogo from '@/images/landing/fcLogo2.png';
import React from 'react';
import styled from 'styled-components';

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <Section>
          <Logo src={FcLogo} alt="UTM Logo" />
          <Title>School of Computing</Title>
          <Subtitle>Faculty of Engineering</Subtitle>
          <Description>
            Our goal is to develop cutting-edge digital talents,
            industry-relevant solutions, and efficient services in computing
            technology.
          </Description>
        </Section>
        <Section>
          <AddressTitle>Address:</AddressTitle>
          <Address>
            Faculty of Computing
            <br />
            Universiti Teknologi Malaysia
            <br />
            81310 UTM Johor Bahru
            <br />
            Johor, Malaysia
          </Address>
        </Section>
        <Section>
          <ContactTitle>Contact Us:</ContactTitle>
          <Contact>
            Academic Office (Postgraduate):{' '}
            <ContactNumber>+607-5538828</ContactNumber>
            <br />
            Academic Office (Undergraduate):{' '}
            <ContactNumber>+607-5538827</ContactNumber>
          </Contact>
        </Section>
      </FooterContent>
      <Copyright>Copyright © 2024 Faculty of Computing</Copyright>
    </FooterContainer>
  );
};

export default Footer;

const FooterContainer = styled.div`
  background-color: #f3f3f3;
  padding-top: 20px;
  text-align: center;
`;

const FooterContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px 30px;
  text-align: left;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const Section = styled.div`
  flex: 1;
  margin: 0 10px;

  @media (max-width: 768px) {
    margin: 10px 0;
    text-align: center;
  }
`;

const Logo = styled.img`
  width: 300px;
  margin-bottom: 10px;
`;

const Title = styled.h2`
  font-size: 1.2rem;
  font-weight: bold;
`;

const Subtitle = styled.h3`
  font-size: 1rem;
  font-weight: normal;
  color: #555;
  margin-bottom: 10px;
`;

const Description = styled.p`
  font-size: 0.9rem;
  color: #555;
`;

const AddressTitle = styled.h3`
  font-size: 1rem;
  font-weight: bold;
  color: maroon;
`;

const Address = styled.p`
  font-size: 0.9rem;
  color: #555;
`;

const ContactTitle = styled.h3`
  font-size: 1rem;
  font-weight: bold;
  color: maroon;
`;

const Contact = styled.p`
  font-size: 0.9rem;
  color: #555;
`;

const ContactNumber = styled.span`
  font-weight: bold;
`;

const Copyright = styled.div`
  background-color: #5c001f;
  color: white;
  padding: 10px;
  font-size: 0.85rem;
`;
