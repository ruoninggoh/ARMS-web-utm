import Footer from '@/components/Layout/Footer/footer';
import Header from '@/components/Layout/Header/header';
import EditableField from '@/components/Profile/EditableField';
import ProfilePicture from '@/components/Profile/ProfilePicture';
import profilePhoto from '@/images/profile/profile.jpg';
import React, { useState } from 'react';
import { styled } from 'styled-components';

const ProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    photo: profilePhoto,
    utmId: '123456',
    firstname: 'John',
    lastname: 'Doe',
    email: 'john.doe@utm.my',
    role: 'Admin',
    phone: '+60123456789',
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      setFormData({ ...formData, photo: URL.createObjectURL(file) });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    console.log('Saving data:', formData);
    setIsEditing(false);
  };

  return (
    <ProfilePageContainer>
      <Header />
      <ContentContainer>
        <FormContainer>
          <Title>Profile</Title>
          <ProfileWrapper>
            <ProfilePicture
              src={formData.photo}
              onImageChange={handleImageChange}
              isEditable={isEditing}
            />
          </ProfileWrapper>
          <EditableField
            label="Role"
            name="role"
            value={formData.role}
            isEditable={false}
            onChange={handleChange}
          />
          <EditableField
            label="UTM ID"
            name="utmId"
            value={formData.utmId}
            isEditable={false}
            onChange={handleChange}
          />
          <EditableField
            label="First Name"
            name="firstname"
            value={formData.firstname}
            isEditable={isEditing}
            onChange={handleChange}
          />
          <EditableField
            label="Last Name"
            name="lastname"
            value={formData.lastname}
            isEditable={isEditing}
            onChange={handleChange}
          />
          <EditableField
            label="Email"
            name="email"
            value={formData.email}
            isEditable={isEditing}
            onChange={handleChange}
          />
          <EditableField
            label="Phone"
            name="phone"
            value={formData.phone}
            isEditable={isEditing}
            onChange={handleChange}
          />
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

const ProfileWrapper = styled.div`
  margin-bottom: 30px;
`;

const FormContainer = styled.div`
  max-width: 1000px; /* Set a max width for the form */
  margin: 0 auto; /* Center the form */
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
  text-decoration: none;

  &:hover {
    background-color: #4a0018;
    transform: scale(1.05);
  }

  &:focus {
    box-shadow: none;
  }
`;
