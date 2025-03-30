import { getUserByUTMID, updateUser } from '@/apis/userTable';
import { emailCharacter, numericOnly } from '@/helpers/InputKeyPressValidator';
import { User } from '@/types/User/User';
import { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { FaRegEdit } from 'react-icons/fa';

interface Props {
  utmid: string;
}

export default function EditUser({ utmid }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<User | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserByUTMID(utmid);
        setEditedUser({ ...userData, password: '' });
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    if (isEditing) {
      fetchUser();
    }
  }, [isEditing, utmid]);

  const handleChange = (field: keyof User, value: string) => {
    if (editedUser) {
      setEditedUser((prev) => ({ ...prev!, [field]: value }));
    }
  };

  const handleSave = async () => {
    if (!editedUser) return;
    // Create a copy of editedUser without the password if it's unchanged
    const updatedUser = { ...editedUser };
    if (!updatedUser.password) {
      delete updatedUser.password; // Remove password from update payload
    }
    setIsSaving(true);
    try {
      await updateUser(utmid, editedUser);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating user:', error);
    } finally {
      setIsSaving(false);
    }
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
            Edit User <FaRegEdit style={{ marginTop: '-9px' }} />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editedUser ? (
            <Form className="p-3">
              <Form.Group className="mb-3">
                <Form.Label>UTMID</Form.Label>
                <Form.Control
                  type="text"
                  value={editedUser.utmid}
                  onChange={(e) => handleChange('utmid', e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  value={editedUser.userName}
                  onChange={(e) => handleChange('userName', e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  onKeyDown={emailCharacter}
                  maxLength={50}
                  value={editedUser.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter a new password (leave empty to keep current password)"
                  value={editedUser.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                />
                <Form.Text className="text-muted text-end d-block">
                  <i>
                    Password must be at least 6 characters with a mix of
                    uppercase, lowercase, number and special character.
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
                  value={editedUser.phoneNumber}
                  onChange={(e) => handleChange('phoneNumber', e.target.value)}
                />
              </Form.Group>
            </Form>
          ) : (
            <p>Loading user data...</p>
          )}
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button
            variant="success"
            onClick={handleSave}
            disabled={isSaving || !editedUser}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
