import { registerUser } from '@/apis/userTable';
import {
  alphaNumericOnly,
  alphabetOnly,
  emailCharacter,
  numericOnly,
} from '@/helpers/InputKeyPressValidator';
import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { IoPersonAddSharp } from 'react-icons/io5';

interface Props {
  onClose: () => void;
}

export default function AddUser({ onClose }: Props) {
  const [user, setUser] = useState({
    utmId: '',
    username: '',
    email: '',
    password: '',
    role: 'Lecturer' as
      | 'Lecturer'
      | 'Admin'
      | 'Hod'
      | 'Program Coordinator'
      | 'Deputy Dean'
      | 'Dean',
    phoneNumber: '',
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };
  const handleSubmit = async () => {
    if (
      !user.utmId.trim() ||
      !user.username.trim() ||
      !user.email.trim() ||
      !user.password.trim() ||
      !user.role.trim() ||
      !user.phoneNumber.trim()
    ) {
      alert('All fields are required. Please fill in all the details.');
      return;
    }

    try {
      await registerUser(user);
      alert('User registered successfully!');
      onClose();
    } catch (error) {
      console.error('Error registering user:', error);
      alert('Failed to register user.');
    }
  };

  return (
    <Modal show onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          Add New User {''}
          <IoPersonAddSharp style={{ marginTop: '-9px' }} />
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form className="p-3">
          <Form.Group className="mb-3">
            <Form.Label>UTM ID</Form.Label>
            <Form.Control
              type="text"
              name="utmId"
              placeholder="Enter UTM ID"
              onKeyDown={alphaNumericOnly}
              onChange={handleChange}
              value={user.utmId}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              name="username"
              placeholder="Enter full name"
              onKeyDown={alphabetOnly}
              onChange={handleChange}
              value={user.username}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Enter email"
              onKeyDown={emailCharacter}
              maxLength={50}
              onChange={handleChange}
              value={user.email}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Enter password"
              onChange={handleChange}
              value={user.password}
            />
            <Form.Text className="text-muted text-end d-block">
              <i>
                Password must be at least 6 characters with a mix of uppercase,
                lowercase, number and special character.
              </i>
            </Form.Text>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Role</Form.Label>
            <Form.Select name="role" onChange={handleChange} value={user.role}>
              <option value="Admin">Admin</option>
              <option value="Lecturer">Lecturer</option>
              <option value="Program Coordinator">Program Coordinator</option>
              <option value="Hod">Head of Department (Hod)</option>
              <option value="Deputy Dean">Deputy Dean</option>
              <option value="Dean">Dean</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Phone No</Form.Label>
            <Form.Control
              type="tel"
              name="phoneNumber"
              placeholder="Enter phone number"
              maxLength={10}
              inputMode="numeric"
              onKeyDown={numericOnly}
              onChange={handleChange}
              value={user.phoneNumber}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer className="justify-content-center">
        <Button variant="success" onClick={handleSubmit}>
          Add User
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
