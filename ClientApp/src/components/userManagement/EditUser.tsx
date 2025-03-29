import { emailCharacter, numericOnly } from '@/helpers/InputKeyPressValidator';
import { User } from '@/types/User/User';
import { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { FaRegEdit } from 'react-icons/fa';

interface Props {
  user: User;
}

export default function EditUser({ user }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<User>(user);

  const handleChange = (field: keyof User, value: string) => {
    setEditedUser((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <Button
        size="sm"
        className="me-2 action-button"
        onClick={() => setIsEditing(true)}
        style={{
          backgroundColor: '#1E3E80',
          borderColor: '#1E3E80',
        }}
      >
        Edit
      </Button>

      <Modal
        show={isEditing}
        onHide={() => setIsEditing(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Edit User {''}
            <FaRegEdit style={{ marginTop: '-9px' }} />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="p-3">
            <Form.Group className="mb-3">
              <Form.Label>UTMID</Form.Label>
              <Form.Control
                type="text"
                value={editedUser.UTMID}
                onChange={(e) => handleChange('UTMID', e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={editedUser.name}
                onChange={(e) => handleChange('name', e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                onKeyDown={emailCharacter}
                maxLength={50}
                value={editedUser.email}
                onChange={(e) => handleChange('email', e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Passsword</Form.Label>
              <Form.Control
                type="password"
                value={editedUser.password}
                onChange={(e) => handleChange('password', e.target.value)}
              />
              <Form.Text className="text-muted text-end d-block">
                <i>
                  {' '}
                  Hint: The password should be at least six characters long
                </i>
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select
                value={editedUser.role}
                onChange={(e) => handleChange('role', e.target.value)}
              >
                <option>Admin</option>
                <option>Lecturer</option>
                <option>Program Coordinator</option>
                <option>Head of Department (Hod)</option>
                <option>Deputy Dean</option>
                <option>Dean</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="tel"
                inputMode="numeric"
                onKeyDown={numericOnly}
                maxLength={10}
                value={editedUser.phoneNo}
                onChange={(e) => handleChange('phoneNo', e.target.value)}
              ></Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          {/* <Button variant="secondary" onClick={() => setIsEditing(false)}>
            Cancel
          </Button> */}
          <Button variant="success">Save</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
