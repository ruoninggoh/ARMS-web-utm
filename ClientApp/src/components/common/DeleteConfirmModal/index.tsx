import { useState } from 'react';
import { Button, Modal, Spinner } from 'react-bootstrap';
import { FaExclamationCircle } from 'react-icons/fa';
import { MdArrowBackIos } from 'react-icons/md';
interface DeleteConfirmProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  message?: string;
}

export default function DeleteConfirmModal({
  show,
  onClose,
  onConfirm,
  message = 'Are you sure you want to delete this?',
}: DeleteConfirmProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('Delete failed:', error);
    } finally {
      setIsDeleting(false);
    }
  };
  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header className="boarder-0">
        <Button variant="link" onClick={onClose} className="p-0">
          <MdArrowBackIos size={20} color="black" />
        </Button>
      </Modal.Header>
      <Modal.Body className="text-center py-4">
        <FaExclamationCircle size={50} color="red" />
        <h4 className="mt-3">Confirm Delete?</h4>
        <p className="mb-5">{message}</p>
        <div className="d-flex justify-content-center mt-5">
          <Button
            style={{ backgroundColor: '#1E3E80', borderColor: '#1E3E80' }}
            variant="danger"
            onClick={handleDelete}
            className="px-5 py-2"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}
