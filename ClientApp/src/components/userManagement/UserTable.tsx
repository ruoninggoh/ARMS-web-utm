import { deleteUser, getAllUsers } from '@/apis/userTable';
import { usePageRedirection } from '@/hooks/usePageRedirection';
import { User } from '@/types/User/User';
import { useEffect, useState } from 'react';
import { Alert, Button, Table } from 'react-bootstrap';
import { toast } from 'react-toastify';
import DeleteConfirmModal from '../common/DeleteConfirmModal';
import EditUser from './EditUser';

interface Props {
  searchTerm: string;
  selectedRole: string;
  refreshKey?: number;
}

export default function UserTable({
  searchTerm,
  selectedRole,
  refreshKey,
}: Props) {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const redirect = usePageRedirection();

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const fetchedUsers = await getAllUsers();
      setUsers(fetchedUsers || []);
    } catch (error) {
      toast.error('Failed to fetch users');
      redirect('login');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [refreshKey]);

  const handleDeleteClick = (id: string) => {
    setSelectedUser(id);
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) {
      setShowModal(false);
      return;
    }

    try {
      const result = await deleteUser(selectedUser);
      if (result.success) {
        await fetchUsers(); // Refresh the user list
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Error deleting user:', error);
      toast.error(errorMessage);
    } finally {
      setShowModal(false);
    }
  };
  const handleUserUpdated = () => {
    fetchUsers();
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
      {isLoading ? (
        <Alert variant="info">Loading users...</Alert>
      ) : filteredUsers.length === 0 ? (
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
                  <EditUser
                    utmid={user.utmid}
                    onUserUpdated={handleUserUpdated}
                  />{' '}
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
