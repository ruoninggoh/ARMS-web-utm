import React, { useState } from 'react';
import { Button, Form, Modal, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { RxCross2 } from 'react-icons/rx';
import { toast } from 'react-toastify';
import styled from 'styled-components';

interface RenameFileModalProps {
  show: boolean;
  onClose: () => void;
  onRename: (newName: string) => Promise<void>;
  currentFileName: string;
}

const RenameFileModal: React.FC<RenameFileModalProps> = ({
  show,
  onClose,
  onRename,
  currentFileName,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      newName: currentFileName,
    },
  });

  const [isRenaming, setIsRenaming] = useState(false);

  const onSubmit = async (data: { newName: string }) => {
    if (data.newName === currentFileName) {
      onClose();
      return;
    }

    setIsRenaming(true);
    try {
      await onRename(data.newName);
      reset();
      onClose();
      toast.success('File renamed successfully');
    } catch (error) {
      console.error('Error renaming file:', error);
      toast.error('Failed to rename file');
    } finally {
      setIsRenaming(false);
    }
  };

  const handleClearError = () => {
    setValue('newName', currentFileName);
  };

  // Get file extension
  const fileExt = currentFileName.split('.').pop() || '';

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Rename File</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form className="p-3" onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3">
            <Form.Label>
              <strong>New File Name</strong>
            </Form.Label>
            <div className="d-flex align-items-center ml-2">
              <Form.Control
                type="text"
                {...register('newName', {
                  required: 'File name is required',
                  validate: (value) => {
                    if (value === currentFileName) {
                      return 'New name must be different';
                    }
                    return true;
                  },
                })}
                placeholder="Enter new file name"
              />
              {fileExt && <span className="ms-2 text-muted">.{fileExt}</span>}
            </div>
            {errors.newName && (
              <ErrorWrapper>
                <DeleteIcon onClick={handleClearError} />
                <ErrorMessage>{String(errors.newName.message)}</ErrorMessage>
              </ErrorWrapper>
            )}
            <Form.Text className="text-muted d-block mt-4">
              Current: {currentFileName}
            </Form.Text>
          </Form.Group>

          <CustomFooter className="justify-content-center">
            <Button variant="secondary" onClick={onClose} disabled={isRenaming}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={isRenaming}>
              {isRenaming ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Renaming...
                </>
              ) : (
                'Rename'
              )}
            </Button>
          </CustomFooter>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default RenameFileModal;
const CustomFooter = styled(Modal.Footer)`
  padding-top: 1.5rem;
  padding-bottom: 0 !important;
  background-color: transparent;
`;

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
