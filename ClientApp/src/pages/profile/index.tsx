import { fetchUserProfile, updateUserProfile } from '@/apis/profile';
import Footer from '@/components/Layout/Footer/footer';
import RoleBasedHeader from '@/components/Layout/Header/RoleBasedHeader';
import EditableField from '@/components/Profile/EditableField';
import { usePageRedirection } from '@/hooks/usePageRedirection';
import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

const ProfilePage: React.FC = () => {
  const isSSR = typeof window === 'undefined';

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const redirect = useCallback(usePageRedirection(), []);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profileData = await fetchUserProfile();
        console.log('API Response:', profileData);

        setFormData({
          utmId: profileData.utmid || '',
          username: profileData.userName || '',
          email: profileData.email || '',
          role: profileData.role || '',
          phoneNumber: profileData.phoneNumber || '',
        });
      } catch (error) {
        console.error('Failed', error);
        redirect('login');
      }
    };

    loadProfile();
  }, [redirect]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value || '' }));
  }, []);

  const handleSave = async () => {
    try {
      await updateUserProfile(formData);
      setIsEditing(false);
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Failed to update profile', error);
      alert('Failed to update profile');
    }
  };
  if (isSSR) return null;

  return (
    <ProfilePageContainer>
      <RoleBasedHeader />
      <ContentContainer>
        <FormContainer>
          <Title>Profile</Title>
          {['role', 'utmId', 'username', 'email', 'phoneNumber'].map(
            (field) => (
              <EditableField
                key={field}
                label={field.charAt(0).toUpperCase() + field.slice(1)}
                name={field}
                value={formData[field] || ''}
                isEditable={isEditing && !['role', 'utmId'].includes(field)}
                onChange={handleChange}
              />
            ),
          )}
          <ButtonWrapper>
            <SaveButton
              onClick={isEditing ? handleSave : () => setIsEditing(true)}
            >
              {isEditing ? 'Save' : 'Edit'}
            </SaveButton>
          </ButtonWrapper>
        </FormContainer>
      </ContentContainer>
      <Footer />
    </ProfilePageContainer>
  );
};

export default ProfilePage;

const ProfilePageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const ContentContainer = styled.div`
  flex: 1;
  padding: 20px;
  margin-top: 50px;
  margin-bottom: 150px;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 20px;
`;

const FormContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const ButtonWrapper = styled.div`
  padding-top: 20px;
  display: flex;
  justify-content: center;
  width: 100%;
`;

const SaveButton = styled.button`
  background-color: #5c001f;
  color: white;
  font-size: 1.2rem;
  transition: background-color 0.3s ease, transform 0.2s ease;
  margin-top: 20px;
  padding: 10px 40px;
  border-radius: 1rem;
  &:hover {
    background-color: #4a0018;
    transform: scale(1.05);
  }
  &:focus {
    box-shadow: none;
  }
  //
`;
