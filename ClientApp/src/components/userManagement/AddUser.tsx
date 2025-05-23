import { registerUser } from '@/apis/userTable';
import {
  alphabetOnly,
  alphaNumericOnly,
  emailCharacter,
  numericOnly,
} from '@/helpers/InputKeyPressValidator';
import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { IoPersonAddSharp } from 'react-icons/io5';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';

const ErrorWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.25rem;
`;

const ErrorMessage = styled.div`
  font-size: 0.875rem;
  color: red;
`;
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

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!user.utmId.trim()) {
      newErrors.utmId = 'UTM ID is required';
    }

    if (!user.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (user.username.length < 6) {
      newErrors.username = 'Username must be at least 6 characters';
    }

    if (!user.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!user.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (user.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!user.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{10}$/.test(user.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid 10-digit phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const { success, message, error } = await registerUser(user);

      if (success) {
        toast.success(message);
        onClose();
      } else {
        // Show the specific error message from API
        toast.error(message);

        // Handle API validation errors if they exist
        if (error?.response?.data?.Errors) {
          const apiErrors = error.response.data.Errors;
          const formattedErrors: Record<string, string> = {};

          Object.keys(apiErrors).forEach((key) => {
            formattedErrors[key.toLowerCase()] = apiErrors[key][0];
          });

          setErrors(formattedErrors);
        }
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred');
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
              isInvalid={!!errors.utmId}
            />
            {errors.utmId && (
              <ErrorWrapper>
                <ErrorMessage>{errors.utmId}</ErrorMessage>
              </ErrorWrapper>
            )}
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
              isInvalid={!!errors.username}
            />
            {errors.username && (
              <ErrorWrapper>
                <ErrorMessage>{errors.username}</ErrorMessage>
              </ErrorWrapper>
            )}
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
              isInvalid={!!errors.email}
            />
            {errors.email && (
              <ErrorWrapper>
                <ErrorMessage>{errors.email}</ErrorMessage>
              </ErrorWrapper>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Enter password"
              onChange={handleChange}
              value={user.password}
              isInvalid={!!errors.password}
            />
            <Form.Text className="text-muted text-end d-block">
              <i>
                Password must be at least 6 characters with a mix of uppercase,
                lowercase, number and special character.
              </i>
            </Form.Text>
            {errors.password && (
              <ErrorWrapper>
                <ErrorMessage>{errors.password}</ErrorMessage>
              </ErrorWrapper>
            )}
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
              isInvalid={!!errors.phoneNumber}
            />
            {errors.phoneNumber && (
              <ErrorWrapper>
                <ErrorMessage>{errors.phoneNumber}</ErrorMessage>
              </ErrorWrapper>
            )}
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
