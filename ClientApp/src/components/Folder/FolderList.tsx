import { createFolder, deleteFolder, getNestedFolders } from '@/apis/folder';
import { Folder } from '@/types/Folder/folder';
import React, { useEffect, useRef, useState } from 'react';
import {
  Badge,
  Breadcrumb,
  Button,
  Col,
  Container,
  Row,
  Spinner,
  Table,
} from 'react-bootstrap';
import { AiOutlineDelete } from 'react-icons/ai';
import { BsThreeDotsVertical } from 'react-icons/bs';
import {
  FaFolder,
  FaFolderOpen,
  FaHome,
  FaPlus,
  FaRegEdit,
  FaShareSquare,
} from 'react-icons/fa';
import { FaRegCommentDots } from 'react-icons/fa6';
import styled from 'styled-components';
import DeleteConfirmModal from '../common/DeleteConfirmModal';
import { LoadingSpinner } from '../common/LoadingSpinner';
import CreateFolderModal from './CreateFolderModal';

const FolderList: React.FC = () => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [currentFolderId, setCurrentFolderId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [breadcrumbs, setBreadcrumbs] = useState<
    { id: number; name: string }[]
  >([]);
  const [creatingFolder, setCreatingFolder] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);

  const handleDeleteClick = (folderId: number) => {
    setSelectedFolderId(folderId);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedFolderId === null) return;

    try {
      await deleteFolder(selectedFolderId);
      setFolders(folders.filter((f) => f.id !== selectedFolderId));
    } catch (err) {
      console.error('Failed to delete folder', err);
    } finally {
      setShowDeleteModal(false);
      setSelectedFolderId(null);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setActiveMenuId(null); // Close dropdown
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch folders based on current context
  useEffect(() => {
    const fetchFolders = async () => {
      setIsLoading(true);
      try {
        const data = await getNestedFolders(currentFolderId ?? undefined);
        setFolders(data);
      } catch (error) {
        console.error('Error fetching folders:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFolders();
  }, [currentFolderId]);

  const handleCreateFolder = async (
    folderName: string,
    assignee?: string | null,
    dueDate?: string | null,
  ) => {
    try {
      setCreatingFolder(true);

      // Send ONLY the current folder ID or empty array (not [0] for root)
      const parentIds = currentFolderId ? [currentFolderId] : [];

      await createFolder({
        folderName,
        lecturerUsername: assignee || undefined,
        parentFolderIds: parentIds,
        dueDate: dueDate || undefined,
      });

      // Refresh with loading state
      setFolders([]);
      const data = await getNestedFolders(currentFolderId ?? undefined);
      setFolders(data);
      setShowModal(false);
    } catch (error) {
      console.error('Error creating folder:', error);
    } finally {
      setCreatingFolder(false);
      setShowModal(false);
    }
  };

  const handleFolderClick = (folderId: number, folderName: string) => {
    console.log('Setting current folder ID to:', folderId); // Add this
    setCurrentFolderId(folderId);
    setBreadcrumbs((prev) => [...prev, { id: folderId, name: folderName }]);
  };

  const handleBreadcrumbClick = (folderId: number) => {
    const index = breadcrumbs.findIndex((b) => b.id === folderId);
    setBreadcrumbs(breadcrumbs.slice(0, index + 1));
    setCurrentFolderId(folderId);
  };

  const handleNavigateHome = () => {
    setCurrentFolderId(null);
    setBreadcrumbs([]);
  };

  const getFullDisplayPath = (folder: Folder) => {
    // Root folder case
    if (!folder.folderPath) return folder.folderName;

    // All other cases
    return `${folder.folderPath}/${folder.folderName}`;
  };

  return (
    <Container className="mt-4 mb-5">
      <MainContent>
        <Row className="mt-2 mb-3 d-flex align-items-center">
          <Col>
            <h4>
              <FaFolder className="me-2" />
              <i>Academic Material</i>
            </h4>
          </Col>
        </Row>
        <Row>
          <Col className="text-end">
            <Button
              className="mb-3 align-items-center btn btn-success"
              onClick={() => setShowModal(true)}
              disabled={isLoading || creatingFolder}
            >
              {creatingFolder ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Creating...
                </>
              ) : (
                <>
                  <FaPlus className="me-2" /> Create Folder
                </>
              )}
            </Button>
          </Col>
        </Row>

        {/* Breadcrumb Navigation */}
        <Breadcrumb>
          <Breadcrumb.Item
            onClick={handleNavigateHome}
            style={{ cursor: 'pointer' }}
          >
            <FaHome className="me-1" />
            Home
          </Breadcrumb.Item>
          {breadcrumbs.map((crumb, index) => (
            <Breadcrumb.Item
              key={crumb.id}
              onClick={() => handleBreadcrumbClick(crumb.id)}
              style={{ cursor: 'pointer' }}
              active={index === breadcrumbs.length - 1}
            >
              {crumb.name}
            </Breadcrumb.Item>
          ))}
        </Breadcrumb>

        {/* Folder List Table */}
        {isLoading ? (
          <div className="text-center my-5">
            <LoadingSpinner />
            <p>Loading folders...</p>
          </div>
        ) : folders.length === 0 ? (
          <div className="text-center my-5">
            <FaFolderOpen size={48} className="text-muted mb-3" />
            <p>No folders found</p>
          </div>
        ) : (
          <StyledTable hover className="shadow-sm m-3">
            <thead>
              <tr>
                <th>Name</th>
                <th>Path</th>
                <th>Last Modified</th>
                <th>Due Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {folders.map((folder) => (
                <tr
                  key={folder.id}
                  onClick={() =>
                    handleFolderClick(folder.id, folder.folderName)
                  }
                  style={{ cursor: 'pointer' }}
                  className="align-middle"
                >
                  <td>
                    <FaFolder className="text-warning me-2 align-icon" />
                    <b>{folder.folderName}</b>
                  </td>
                  <td>{getFullDisplayPath(folder)}</td>
                  <td>
                    {new Date(folder.lastModified).toLocaleDateString()}{' '}
                    {/* Show last modified */}
                  </td>
                  <td>
                    {folder.dueDate
                      ? new Date(folder.dueDate).toLocaleDateString()
                      : '-'}
                  </td>

                  <td>
                    <Badge bg="secondary">Active</Badge>
                  </td>

                  <td
                    className="text-end position-relative"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span
                      className="text-dark p-0 border-0 cursor-pointer"
                      onClick={() =>
                        setActiveMenuId(
                          activeMenuId === folder.id ? null : folder.id,
                        )
                      }
                    >
                      <BsThreeDotsVertical />
                    </span>
                    {activeMenuId === folder.id && (
                      <div
                        className="custom-dropdown mt-2"
                        style={{ right: 0 }}
                        ref={dropdownRef} // <-- attach ref here
                      >
                        <div className="custom-dropdown-item">
                          <FaRegEdit /> Edit
                        </div>
                        <div className="custom-dropdown-item">
                          <FaRegCommentDots /> Comment
                        </div>
                        <div
                          className="custom-dropdown-item"
                          onClick={() => handleDeleteClick(folder.id)}
                        >
                          <AiOutlineDelete /> Delete
                        </div>
                        <div className="custom-dropdown-item">
                          <FaShareSquare /> Share
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </StyledTable>
        )}
      </MainContent>

      <CreateFolderModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onCreate={handleCreateFolder}
        currentFolderName={
          breadcrumbs.length > 0
            ? breadcrumbs[breadcrumbs.length - 1].name
            : undefined
        }
        currentFolderId={currentFolderId} // This is correctly passed now
      />

      <DeleteConfirmModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        message="Are you sure you want to delete this folder?"
      />
    </Container>
  );
};

export default FolderList;

const MainContent = styled.div`
  margin-bottom: 150px;
`;

const StyledTable = styled(Table)`
  width: 100%;
  border-collapse: collapse;

  .align-icon {
    position: relative;
    top: -3px; /* Moves the icon slightly up */
  }

  th {
    background-color: #f8f9fa !important;
    font-weight: bold;
    text-align: left;
    padding: 10px 15px;
  }

  td {
    padding: 10px 15px;
  }

  tbody tr {
    border-bottom: none;
    transition: background-color 0.2s;
  }

  tbody td {
    padding: 30px 15px;
  }

  tbody tr:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }

  td:last-child {
    width: 40px;
    text-align: right;
  }

  .cursor-pointer {
    cursor: pointer;
  }

  /* Dropdown-style menu */
  .custom-dropdown {
    position: absolute;
    background-color: white;
    border: 1px solid #dee2e6;
    border-radius: 8px;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
    min-width: 180px;
    z-index: 1000;
    padding: 8px 0;
  }

  .custom-dropdown-item {
    display: flex;
    align-items: center;
    padding: 10px 18px;
    font-size: 16px;
    color: #212529;
    transition: background-color 0.2s ease-in-out;
    white-space: nowrap;
  }

  .custom-dropdown-item:hover {
    background-color: #f1f1f1;
    color: #0d6efd;
  }

  .custom-dropdown-item svg {
    margin-right: 10px;
    position: relative;
    top: -1px; /* Move icons up slightly */
  }
`;
