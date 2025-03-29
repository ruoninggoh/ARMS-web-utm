import { User } from '@/types/User/User';
import { useState } from 'react';
import { Alert, Button, Table } from 'react-bootstrap';
import DeleteConfirmModal from '../common/DeleteConfirmModal';
import EditUser from './EditUser';

const usersData: User[] = [
  {
    UTMID: 'A0001',
    name: 'Husna',
    email: 'husna@utm.my',
    password: 'husna',
    role: 'Lecturer',
    phoneNo: '0128881234',
  },
  {
    UTMID: 'A0002',
    name: 'Ali',
    email: 'ali123@utm.my',
    password: 'husna',
    role: 'Lecturer',
    phoneNo: '0128881234',
  },
  {
    UTMID: 'A0003',
    name: 'RuoNing',
    email: 'ruoning@utm.my',
    password: 'husna',
    role: 'Hod',
    phoneNo: '0128881234',
  },
  {
    UTMID: 'A0004',
    name: 'Sim',
    email: 'hiewmoi@utm.my',
    password: 'husna',
    role: 'Dean',
    phoneNo: '0128881234',
  },
];

interface Props {
  searchTerm: string;
  selectedRole: string;
}

export default function UserTable({ searchTerm, selectedRole }: Props) {
  const [users, setUsers] = useState<User[]>(usersData);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleDeleteClick = (id: string) => {
    setSelectedUser(id);
    setShowModal(true);
  };

  const handleConfirmDelete = () => {
    setUsers(users.filter((user) => user.UTMID !== selectedUser));
    setShowModal(false);
  };
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedRole === '' ||
        user.role.toLowerCase() === selectedRole.toLowerCase()),
  );

  return (
    <>
      {filteredUsers.length === 0 ? (
        <Alert variant="warning">No users found.</Alert>
      ) : (
        <Table striped bordered hover>
          <thead className="bg-dark text-white">
            <tr>
              <th>User ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th style={{ width: '350px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.UTMID}>
                <td>{user.UTMID}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <EditUser user={user} />
                  <Button
                    variant="danger"
                    size="sm"
                    className="ms-2 action-button"
                    onClick={() => handleDeleteClick(user.UTMID)}
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
      />
    </>
  );
}
