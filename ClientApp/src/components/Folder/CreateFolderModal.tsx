import { getAssigneeList } from '@/apis/folder';
import { User } from '@/types/User/User';
import React, { useEffect, useState } from 'react';
import { Button, Form, Modal, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { FaCalendarAlt } from 'react-icons/fa';
import { RxCross2 } from 'react-icons/rx';
import styled from 'styled-components';

interface CreateFolderModalProps {
  show: boolean;
  onClose: () => void;
  onCreate: (
    folderName: string,
    assignee?: string | null,
    dueDate?: string | null,
  ) => void;
  currentFolderName?: string;
  currentFolderId?: number | null;
}

const CreateFolderModal: React.FC<CreateFolderModalProps> = ({
  show,
  onClose,
  onCreate,
  currentFolderName,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [creatingFolder, setCreatingFolder] = useState(false); // Added loading state
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    if (show) {
      const fetchUsers = async () => {
        setLoadingUsers(true);
        try {
          const assigneeList = await getAssigneeList();
          setUsers(assigneeList);
        } catch (error) {
          console.error('Failed to fetch users:', error);
        } finally {
          setLoadingUsers(false);
        }
      };
      fetchUsers();
    }
  }, [show]);

  const onSubmit = async (data: any) => {
    const formattedDate = data.dueDate
      ? new Date(data.dueDate).toISOString()
      : null;
    setCreatingFolder(true); // Start loading
    try {
      await onCreate(
        data.folderName,
        data.assignee || null, // Pass null if empty
        formattedDate,
      );
      reset();
    } finally {
      setCreatingFolder(false); // End loading
    }
  };

  const handleClearError = (field: string) => {
    reset({ [field]: '' });
  };

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Create Folder</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {currentFolderName && (
          <div className="mb-3 text-muted">
            <small>
              Location: <strong>{currentFolderName}</strong>
            </small>
          </div>
        )}
        <Form className="p-3" onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3">
            <Form.Label>
              <strong>New Folder</strong>
            </Form.Label>
            <Form.Control
              type="text"
              {...register('folderName', {
                required: 'Folder name is required',
              })}
              placeholder="Enter folder name"
            />
            {errors.folderName && (
              <ErrorWrapper>
                <DeleteIcon onClick={() => handleClearError('folderName')} />
                <ErrorMessage>{String(errors.folderName.message)}</ErrorMessage>
              </ErrorWrapper>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              <strong>Assignee To (Optional)</strong>
            </Form.Label>
            {loadingUsers ? (
              <Spinner animation="border" size="sm" />
            ) : (
              <Form.Control
                as="select"
                {...register('assignee')}
                defaultValue="none"
              >
                <option value="none">No assignee</option>
                {users.map((user) => (
                  <option key={user.utmid} value={user.userName}>
                    {/* {user.userName} ({user.utmid})Removed the UTMID display */}
                    {user.userName}
                  </option>
                ))}
              </Form.Control>
            )}
            {errors.assignee && (
              <ErrorWrapper>
                <DeleteIcon onClick={() => handleClearError('assignee')} />
                <ErrorMessage>{String(errors.assignee.message)}</ErrorMessage>
              </ErrorWrapper>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>
              <strong>Set Due Date</strong>
            </Form.Label>
            <Form.Text className="d-block mb-2 text-muted">
              Setting a due date helps remind lecturers of the deadline to
              ensure timely submission.
            </Form.Text>
            <div className="d-flex align-items-center">
              <Form.Control
                // type="date"
                type="datetime-local"
                {...register(
                  'dueDate',
                  // , { required: 'Due date is required' }
                )}
              />

              <Button variant="outline-secondary" disabled className="ms-2">
                <FaCalendarAlt />
              </Button>
            </div>
            {errors.dueDate && (
              <ErrorWrapper>
                <DeleteIcon onClick={() => handleClearError('dueDate')} />
                <ErrorMessage>{String(errors.dueDate.message)}</ErrorMessage>
              </ErrorWrapper>
            )}
          </Form.Group>

          <Modal.Footer className="justify-content-center">
            <Button
              variant="secondary"
              onClick={onClose}
              disabled={creatingFolder}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={creatingFolder}>
              {creatingFolder ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Creating...
                </>
              ) : (
                'Create'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateFolderModal;

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

const DeleteIcon = styled(RxCross2)`
  cursor: pointer;
  color: red;
`;
