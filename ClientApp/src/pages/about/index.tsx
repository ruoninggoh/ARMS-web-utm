import Footer from '@/components/Layout/Footer/footer';
import Header from '@/components/Layout/Header/header';
import OrganizationChart from '@/images/about/OrganizationChart.png';
import AboutPic from '@/images/about/aboutLatest.jpg';
import React from 'react';
import styled from 'styled-components';

const AboutUs: React.FC = () => {
  return (
    <PageContainer>
      <Header />
      <ContentContainer>
        <BannerSection>
          <TextOverlay>
            <h1>About Us</h1>
            <h2>Faculty of Computing</h2>
          </TextOverlay>
          <BannerImage
            src={AboutPic}
            alt="About us banner showing the Faculty of Computing"
          />
        </BannerSection>

        <Chart>
          <SectionTitle>Management Organization Charts</SectionTitle>
          <img
            src={OrganizationChart}
            alt="Faculty of Computing management organization chart"
            style={{ width: '100%', maxWidth: '1200px', height: 'auto' }}
          />
        </Chart>
      </ContentContainer>
      <Footer />
    </PageContainer>
  );
};

export default AboutUs;

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const ContentContainer = styled.main`
  flex: 1;
`;

const BannerSection = styled.section`
  position: relative;
  text-align: center;
  margin-bottom: 2rem;
`;

const SectionTitle = styled.div`
  display: flex;
  align-items: center;
  background-color: #dce1f9;
  border-radius: 30px;
  padding: 10px 20px;
  font-size: 25px;
  font-weight: bold;
  color: black;
  width: fit-content;
  text-align: center;
  justify-content: center;
  margin: 0 auto;
`;

const Chart = styled.section`
  text-align: center;
  margin-top: 3rem;
  margin-bottom: 200px;
`;

const TextOverlay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  z-index: 2;

  h1 {
    font-size: 3.4rem;
    margin: 20px;
  }

  h2 {
    font-size: 3rem;
    margin: 0;
  }
`;

const BannerImage = styled.img`
  width: 100%;
  height: 500px;
  object-fit: cover;
  object-position: center;
`;
