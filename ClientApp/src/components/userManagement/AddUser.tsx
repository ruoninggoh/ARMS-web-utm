import {
  alphaNumericOnly,
  alphabetOnly,
  emailCharacter,
  numericOnly,
} from '@/helpers/InputKeyPressValidator';
import { Button, Form, Modal } from 'react-bootstrap';
import { IoPersonAddSharp } from 'react-icons/io5';

interface Props {
  onClose: () => void;
}

export default function AddUser({ onClose }: Props) {
  // const [user, setUser] = useState({ name: '', email: '', role: 'Lecturer' });

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
              placeholder="Enter UTM ID"
              onKeyDown={alphaNumericOnly}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter full name"
              onKeyDown={alphabetOnly}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              onKeyDown={emailCharacter}
              maxLength={50}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Enter password" />
            <Form.Text className="text-muted text-end d-block">
              <i> Hint: The password should be at least six characters long</i>
            </Form.Text>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Role</Form.Label>
            <Form.Select>
              <option>Admin</option>
              <option>Lecturer</option>
              <option>Program Coordinator</option>
              <option>Head of Department (Hod)</option>
              <option>Deputy Dean</option>
              <option>Dean</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Phone No</Form.Label>
            <Form.Control
              type="tel"
              placeholder="Enter phone number"
              maxLength={10}
              inputMode="numeric"
              onKeyDown={numericOnly}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer className="justify-content-center">
        {/* <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button> */}
        <Button variant="success">Add User</Button>
      </Modal.Footer>
    </Modal>
  );
}
