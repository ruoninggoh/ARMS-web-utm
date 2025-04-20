import { uploadFile } from '@/apis/file';
import React, { useCallback, useRef, useState } from 'react';
import { Alert, Button, Modal, ProgressBar, Spinner } from 'react-bootstrap';
import { FaCloudUploadAlt, FaFileUpload, FaTimes } from 'react-icons/fa';
import { RxCross2 } from 'react-icons/rx';
import styled from 'styled-components';

interface UploadFileModalProps {
  show: boolean;
  onClose: () => void;
  onUploadSuccess: () => void;
  currentFolderId: number | null;
  currentFolderName?: string;
}

const UploadFileModal: React.FC<UploadFileModalProps> = ({
  show,
  onClose,
  onUploadSuccess,
  currentFolderId,
  currentFolderName,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      console.log('Selected file:', {
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
      });
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);

      await uploadFile(currentFolderId, file, (progressEvent) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          setUploadProgress(percentCompleted);
        }
      });

      onUploadSuccess();
      resetAndClose();
    } catch (err) {
      console.error('File upload failed:', err);
      setError(
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Failed to upload file. Please try again.',
      );
    } finally {
      setIsUploading(false);
    }
  };

  const resetAndClose = useCallback(() => {
    setFile(null);
    setUploadProgress(0);
    setError(null);
    setIsDragging(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  }, [onClose]);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Modal show={show} onHide={resetAndClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          <FaFileUpload className="me-2" />
          Upload File
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {currentFolderName && (
          <div className="mb-3 text-muted">
            <small>
              Location: <strong>{currentFolderName}</strong>
            </small>
          </div>
        )}

        {error && (
          <Alert variant="danger" className="d-flex align-items-center">
            <RxCross2 className="me-2" />
            {error}
          </Alert>
        )}

        <DragDropArea
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          isDragging={isDragging}
          onClick={triggerFileInput}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />

          {isDragging ? (
            <div className="drag-content">
              <FaCloudUploadAlt size={48} className="text-primary mb-3" />
              <p className="h5">Drop your file here</p>
            </div>
          ) : (
            <div className="drag-content">
              <FaCloudUploadAlt size={48} className="text-muted mb-3" />
              <p className="h5">Drag and drop files here</p>
              <p className="text-muted">or</p>
              <Button variant="outline-primary">Browse Files</Button>
            </div>
          )}
        </DragDropArea>

        {file && (
          <FilePreviewContainer>
            <div className="file-info">
              <strong>Selected file:</strong> {file.name}
              <br />
              <small className="text-muted">
                Size: {(file.size / 1024 / 1024).toFixed(2)} MB
              </small>
            </div>
            <Button
              variant="link"
              size="sm"
              onClick={() => setFile(null)}
              className="text-danger"
            >
              <RxCross2 />
            </Button>
          </FilePreviewContainer>
        )}

        {isUploading && (
          <div className="mt-4">
            <ProgressBar
              now={uploadProgress}
              label={`${uploadProgress}%`}
              animated
              striped
              variant="success"
              className="mb-2"
            />
            <p className="text-center text-muted">Uploading {file?.name}...</p>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={resetAndClose}
          disabled={isUploading}
        >
          <FaTimes className="me-2" />
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleUpload}
          disabled={isUploading || !file}
        >
          {isUploading ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Uploading...
            </>
          ) : (
            'Upload File'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

// Styled components
const DragDropArea = styled.div<{ isDragging: boolean }>`
  border: 2px dashed ${(props) => (props.isDragging ? '#0d6efd' : '#dee2e6')};
  border-radius: 8px;
  padding: 3rem;
  text-align: center;
  cursor: pointer;
  background-color: ${(props) =>
    props.isDragging ? 'rgba(13, 110, 253, 0.05)' : 'transparent'};
  transition: all 0.2s ease;

  &:hover {
    border-color: #0d6efd;
    background-color: rgba(13, 110, 253, 0.05);
  }

  .drag-content {
    pointer-events: none;
  }
`;

const FilePreviewContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  margin-top: 1rem;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  background-color: #f8f9fa;
`;

export default UploadFileModal;
