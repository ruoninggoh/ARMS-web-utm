import { deleteUser, getAllUsers } from '@/apis/userTable';
import { usePageRedirection } from '@/hooks/usePageRedirection';
import { User } from '@/types/User/User';
import { useEffect, useState } from 'react';
import { Alert, Button, Table } from 'react-bootstrap';
import DeleteConfirmModal from '../common/DeleteConfirmModal';
import EditUser from './EditUser';

interface Props {
  searchTerm: string;
  selectedRole: string;
}

export default function UserTable({ searchTerm, selectedRole }: Props) {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const redirect = usePageRedirection();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await getAllUsers();
        setUsers(fetchedUsers || []); // Ensure it is always an array
      } catch (error) {
        console.error('Failed to fetch users:', error);
        redirect('login');
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteClick = (id: string) => {
    setSelectedUser(id);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedUser) {
      try {
        await deleteUser(selectedUser);
        setUsers(users.filter((user) => user.utmid !== selectedUser));
        setSuccessMessage('User deleted successfully. ');
        setTimeout(() => setSuccessMessage(null), 3000);
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
    setShowModal(false);
  };

  const filteredUsers = Array.isArray(users)
    ? users.filter(
        (user) =>
          user.userName.toLowerCase().includes(searchTerm.toLowerCase()) &&
          (selectedRole === '' ||
            user.role.toLowerCase() === selectedRole.toLowerCase()),
      )
    : [];

  return (
    <>
      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      {filteredUsers.length === 0 ? (
        <Alert variant="warning">No users found.</Alert>
      ) : (
        <Table striped bordered hover>
          <thead className="bg-dark text-white">
            <tr>
              <th>UTMID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th style={{ width: '350px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.utmid}>
                <td>{user.utmid}</td>
                <td>{user.userName}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <EditUser utmid={user.utmid} />
                  <Button
                    variant="danger"
                    size="sm"
                    className="ms-2 action-button"
                    onClick={() => handleDeleteClick(user.utmid)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <DeleteConfirmModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirmDelete}
        message="Are you sure you want to delete this user?"
      />
    </>
  );
}
