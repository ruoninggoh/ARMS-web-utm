import Footer from '@/components/Layout/Footer/footer';
import AdminHeader from '@/components/Layout/Header/AdminHeader';
import AddUser from '@/components/userManagement/AddUser';
import UserTable from '@/components/userManagement/UserTable';
import React, { useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { IoPersonAddSharp } from 'react-icons/io5';
import styled from 'styled-components';

const UserManagement: React.FC = () => {
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');

  return (
    <Container>
      <AdminHeader />
      <MainContent>
        <div className="mt-4">
          <h2 className="mb-5">User Management</h2>
        </div>

        {/* Search & Filter */}
        <Row className="mb-4 align-items-center">
          <Col md={4}>
            <Form.Control
              type="text"
              placeholder="Search By Username"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Col>
          <Col md={3}>
            <Form.Select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="Lecturer">Lecturer</option>
              <option value="Program Coordinator">Program Coordinator</option>
              <option value="Hod">Hod</option>
              <option value="Deputy Dean">Deputy Dean</option>
              <option value="Dean">Dean</option>
            </Form.Select>
          </Col>
          <Col md={2}>
            <Button
              style={{ backgroundColor: '#1E3E80', borderColor: '#1E3E80' }}
            >
              Search
            </Button>
          </Col>

          <Col md={3} className="text-end">
            <Button variant="success" onClick={() => setIsAddingUser(true)}>
              <IoPersonAddSharp /> New User
            </Button>
          </Col>
        </Row>

        {/* User Table Component */}
        <UserTable searchTerm={searchTerm} selectedRole={selectedRole} />

        {/* Add User Modal */}
        {isAddingUser && <AddUser onClose={() => setIsAddingUser(false)} />}
      </MainContent>
      <Footer />
    </Container>
  );
};

export default UserManagement;

const Container = styled.div`
  background-color: #f8f9fa;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.div`
  padding: 40px 120px;
  margin-bottom: 100px;
  flex: 1;

  .action-buttons {
    display: flex;
    gap: 15px; /* Space between Edit & Delete buttons */
    justify-content: flex-start; /* Align buttons to the left */
  }

  .action-button {
    min-width: 90px; /* Ensure both buttons are same width */
    text-align: center;
  }
`;
