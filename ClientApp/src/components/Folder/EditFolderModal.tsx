import { getAssigneeList } from '@/apis/folder';
import { Folder } from '@/types/Folder/folder';
import { User } from '@/types/User/User';
import React, { useEffect, useState } from 'react';
import { Button, Form, Modal, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { FaCalendarAlt } from 'react-icons/fa';
import { RxCross2 } from 'react-icons/rx';
import styled from 'styled-components';

interface EditFolderModalProps {
  show: boolean;
  onClose: () => void;
  onEdit: (
    folderName: string,
    assignee?: string | null,
    dueDate?: string | null,
    parentFolderIds?: number[],
  ) => Promise<void>;
  currentFolder: Folder | null;
  parentFolderName?: string;
}

const EditFolderModal: React.FC<EditFolderModalProps> = ({
  show,
  onClose,
  onEdit,
  currentFolder,
  parentFolderName,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  const [editingFolder, setEditingFolder] = useState(false);
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

  // Initialize form with current folder data
  useEffect(() => {
    if (currentFolder) {
      reset({
        folderName: currentFolder.folderName,
        assignee: currentFolder.lecturerUsername || 'none', // Set to 'none' if no assignee
        dueDate: currentFolder.dueDate
          ? formatDateTimeLocal(currentFolder.dueDate)
          : '',
      });
    }
  }, [currentFolder, reset]);

  const onSubmit = async (data: any) => {
    const formattedDate = data.dueDate ? convertToUTC(data.dueDate) : null;
    setEditingFolder(true);
    try {
      await onEdit(
        data.folderName,
        data.assignee === 'none' ? null : data.assignee, // Handle 'none' selection
        formattedDate,
      );
    } finally {
      setEditingFolder(false);
    }
  };

  const handleClearError = (field: string) => {
    setValue(field, field === 'assignee' ? 'none' : '');
  };

  const formatDateTimeLocal = (utcDateString: string) => {
    const date = new Date(utcDateString);
    const offset = date.getTimezoneOffset(); // in minutes
    const localDate = new Date(date.getTime() - offset * 60000); // To Malaysia time
    return localDate.toISOString().slice(0, 16);
  };

  const convertToUTC = (localDataString: string) => {
    const localDate = new Date(localDataString);
    return new Date(
      localDate.getTime() - localDate.getTimezoneOffset() * 60000,
    ).toISOString();
  };

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Edit Folder</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {parentFolderName && (
          <div className="mb-3 text-muted">
            <small>
              Location: <strong>{parentFolderName}</strong>
            </small>
          </div>
        )}
        <Form className="p-3" onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3">
            <Form.Label>
              <strong>Folder Name</strong>
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
              <strong>Due Date</strong>
            </Form.Label>
            <Form.Text className="d-block mb-2 text-muted">
              Update the due date if needed
            </Form.Text>
            <div className="d-flex align-items-center">
              <Form.Control type="datetime-local" {...register('dueDate')} />
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
              disabled={editingFolder}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={editingFolder}>
              {editingFolder ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Updating...
                </>
              ) : (
                'Update'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

// Reuse your existing styled components
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

export default EditFolderModal;
