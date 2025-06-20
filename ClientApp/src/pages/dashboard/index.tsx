import Footer from '@/components/Layout/Footer/footer';
import CloudCheckIcon from '@/images/dashboard/cloud-check.svg';
// import DashboardPic from '@/images/dashboard/dashboardPic.jpg';
import { getUser } from '@/apis/auth';
import DashboardPic from '@/images/dashboard/UTM-image.jpg';
import AccessFile2 from '@/images/dashboard/accessFile2.jpg';

import { usePageRedirection } from '@/hooks/usePageRedirection';
import React, { useEffect } from 'react';
import styled from 'styled-components';
import RoleBasedHeader from '@/components/Layout/Header/RoleBasedHeader';

const Dashboard: React.FC = () => {
  const user = getUser();
  const redirect = usePageRedirection();

  console.log('Retrieved user:', user); // Check if user data is correctly retrieved
  console.log(localStorage.getItem('user'));
  useEffect(() => {
    if (!user) {
      console.log('no user');

      redirect('login');
    }
  }, [redirect, user]);
  if (!user) return null; // Prevent UI flicker before redirect

  return (
    <Container>
      <RoleBasedHeader />
      <MainContent>
        <div className="mb-4">
          <h4>Hi, {user?.userName || 'User'}</h4>
        </div>
        <Banner>
          <BannerText>
            Welcome to Academic Resource Management System
          </BannerText>
          <SearchBox type="text" placeholder="Search..." />
        </Banner>

        <Section>
          <SectionTitle>
            {' '}
            <Icon src={CloudCheckIcon} alt="Cloud Check" />
            Completion of Program
          </SectionTitle>
          <CardContainer>
            {programs.map((program) => (
              <ProgramCard key={program.name}>
                <ProgramTitle>{program.name}</ProgramTitle>
                <div>
                  <CircularProgress
                    percentage={program.percentage}
                    color={program.color}
                  />
                </div>
                <Legend>
                  <LegendItem>
                    <LegendDot color={program.color} /> % Complete
                  </LegendItem>
                  <LegendItem>
                    <LegendDot color="#ccc" /> Remaining Program
                  </LegendItem>
                </Legend>
              </ProgramCard>
            ))}
          </CardContainer>
        </Section>

        {/* Recent Accessed Files Section */}
        <Section>
          <SectionTitle>📂 Recent Accessed File</SectionTitle>
          <FileContainer>
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <FileCard key={item}>
                <FileThumbnail src={AccessFile2} alt="File" />
                <FileTitle>B1_CISECJ353</FileTitle>
                <FileDate>📅 Last modified: Mar 26, 2023</FileDate>
              </FileCard>
            ))}
          </FileContainer>
        </Section>
      </MainContent>
      <Footer />
    </Container>
  );
};

export default Dashboard;

const programs = [
  { name: 'Software Engineering', percentage: 30, color: '#3498db' },
  { name: 'Bioinformatics', percentage: 41, color: '#4169E1' },
  { name: 'Data Engineering', percentage: 28, color: '#E74C3C' },
  { name: 'Networks and Security', percentage: 41, color: '#4169E1' },
  { name: 'Graphics and Multimedia', percentage: 28, color: '#E74C3C' },
];

const CircularProgress = ({
  percentage,
  color,
}: {
  percentage: number;
  color: string;
}) => {
  return (
    <CircularContainer>
      <svg width="120" height="120">
        <circle
          cx="60"
          cy="60"
          r="45"
          stroke="#ddd"
          strokeWidth="8"
          fill="none"
        />
        <circle
          cx="60"
          cy="60"
          r="45"
          stroke={color}
          strokeWidth="8"
          fill="none"
          strokeDasharray="282"
          strokeDashoffset={282 - (282 * percentage) / 100}
        />
      </svg>
      <PercentageText>{percentage}%</PercentageText>
    </CircularContainer>
  );
};

/* Styled Components */
const Container = styled.div`
  background-color: #f8f9fa;
`;

const MainContent = styled.div`
  padding: 40px;
  margin-bottom: 100px;
`;

const Banner = styled.div`
  background: url(${DashboardPic}) center/cover no-repeat;

  text-align: center;
  color: white;
  padding: 80px 20px;
  border-radius: 15px;
  margin-bottom: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const BannerText = styled.h1`
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 30px;
`;

const SearchBox = styled.input`
  width: 50%;
  padding: 10px;
  margin-top: 15px;
  border-radius: 20px;
  border: none;
  text-align: center;
  font-size: 16px;
`;
const Section = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 50px;
`;

const SectionTitle = styled.div`
  display: flex;
  align-items: center;
  background-color: #dce1f9; /* Light blue background */
  border-radius: 30px; /* Rounded edges */
  padding: 10px 20px; /* Padding for better spacing */
  font-size: 15px;
  font-weight: bold;
  color: black;
  width: fit-content; /* Only wrap content */
  margin-bottom: 20px;
`;

const Icon = styled.img`
  width: 28px;
  height: 28px;
  margin-right: 8px;
`;

const CardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center; /* Centers when fewer items */
  gap: 20px;
  margin: 0 auto;
`;

const ProgramCard = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  width: calc(33.33% - 20px); /* 3 cards per row */
  min-width: 250px;

  @media (max-width: 768px) {
    width: calc(50% - 20px); /* 2 cards per row */
  }

  @media (max-width: 500px) {
    width: 100%; /* 1 card per row */
  }
`;

const ProgramTitle = styled.h3`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 2px solid #ddd;
`;

const CircularContainer = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto;
`;

const PercentageText = styled.span`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 25px;
  font-weight: bold;
`;

const Legend = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end; /* Move legend to the right */
  font-size: 12px;
  margin-left: 25px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
`;

const LegendDot = styled.span<{ color: string }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${(props) => props.color};
  display: inline-block;
  margin-right: 5px;
`;

const FileContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
`;

const FileCard = styled.div`
  background: white;
  padding: 10px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
`;

const FileThumbnail = styled.img`
  width: 100%;
  border-radius: 8px;
`;

const FileTitle = styled.h4`
  margin-top: 8px;
  font-size: 14px;
  font-weight: bold;
`;

const FileDate = styled.p`
  font-size: 12px;
  color: gray;
`;
