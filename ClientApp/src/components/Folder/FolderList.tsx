/* eslint-disable @typescript-eslint/no-unused-vars */
import api from '@/apis/api';
import { getCommentsByFolder } from '@/apis/comment';
import {
  deleteFile,
  downloadFile,
  getFilesByFolder,
  updateFileName,
} from '@/apis/file';
import {
  createFolder,
  deleteFolder,
  editFolder,
  getNestedFolders,
} from '@/apis/folder';
import { CommentDto } from '@/types/Comment/Comment';
import { File } from '@/types/File/file';
import { FilePrefixDto } from '@/types/FileSet/FilePrefixDto';
import { Folder } from '@/types/Folder/folder';
import React, { useEffect, useRef, useState } from 'react';
import {
  Badge,
  Breadcrumb,
  Col,
  Container,
  Dropdown,
  Row,
  Spinner,
  Table,
} from 'react-bootstrap';
import { AiOutlineDelete } from 'react-icons/ai';
import { BsThreeDotsVertical } from 'react-icons/bs';
import {
  FaDownload,
  FaFileAlt,
  FaFileExcel,
  FaFileImage,
  FaFilePdf,
  FaFileUpload,
  FaFileWord,
  FaFolder,
  FaFolderOpen,
  FaFolderPlus,
  FaHome,
  FaPlus,
  FaRegEdit,
} from 'react-icons/fa';
import { FaRegCommentDots } from 'react-icons/fa6';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';
import DeleteConfirmModal from '../common/DeleteConfirmModal';
import { LoadingSpinner } from '../common/LoadingSpinner';
import RenameFileModal from '../File/RenameFileModal';
import UploadFileModal from '../File/UploadFileModal';
import CommentModal from './CommentModal';
import CreateFolderModal from './CreateFolderModal';
import EditFolderModal from './EditFolderModal';

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
  const [deleteTarget, setDeleteTarget] = useState<'file' | 'folder' | null>(
    null,
  );
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [selectedFileId, setSelectedFileId] = useState<number | null>(null);
  const [editingFolder, setEditingFolder] = useState<Folder | null>(null);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [fileToRename, setFileToRename] = useState<File | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  // Comment
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedFolderForComment, setSelectedFolderForComment] = useState<
    number | null
  >(null);
  const [comments, setComments] = useState<CommentDto[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);

  // Comment
  const fetchComments = async (folderId: number) => {
    try {
      setLoadingComments(true);
      const commentsData = await getCommentsByFolder(folderId);
      setComments(commentsData); // go chatgpt
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoadingComments(false);
    }
  };

  // File upload
  const handleUploadSuccess = async () => {
    try {
      if (currentFolderId !== null) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const files = await getFilesByFolder(currentFolderId);
        setFiles(files);
        toast.success('File uploaded successfully.');
      }
    } catch (error) {
      console.error('Error refreshing files:', error);
      toast.error('Failed to upload file. Please try again.');
    }
  };

  // Add this useEffect to fetch files when folder changes
  useEffect(() => {
    const fetchFiles = async () => {
      if (currentFolderId !== null) {
        try {
          console.log('Fetching files for folder:', currentFolderId); // Add this
          const filesData = await getFilesByFolder(currentFolderId);
          console.log('Files received:', filesData); // Add this
          setFiles(filesData);
        } catch (error) {
          console.error('Error fetching files:', error);
        }
      } else {
        setFiles([]);
      }
    };
    fetchFiles();
  }, [currentFolderId]);

  const handleDownloadFile = async (fileId: number, fileName: string) => {
    try {
      setIsLoading(true);
      const blob = await downloadFile(fileId);

      // Verify blob has content
      if (blob.size === 0) {
        throw new Error('Received empty file');
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();

      // Cleanup
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error('Download failed:', error);
      // Show error to user
    } finally {
      setIsLoading(false);
    }
  };

  // Replace the handleRenameFile function with:
  const handleRenameClick = (file: File) => {
    setFileToRename(file);
    setShowRenameModal(true);
  };

  const handleRenameFile = async (newName: string) => {
    if (!fileToRename) return;
    const updatedFile = await updateFileName(fileToRename.id, newName);
    setFiles(files.map((f) => (f.id === fileToRename.id ? updatedFile : f)));
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();

    switch (ext) {
      case 'pdf':
        return <FaFilePdf className="text-danger me-2" />;
      case 'doc':
      case 'docx':
        return <FaFileWord className="text-primary me-2" />;
      case 'xls':
      case 'xlsx':
        return <FaFileExcel className="text-success me-2" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <FaFileImage className="text-info me-2" />;
      default:
        return <FaFileAlt className="text-secondary me-2" />;
    }
  };

  // Enhanced handleEditFolder with proper error handling
  const handleEditFolder = async (
    folderName: string,
    assignee?: string | null,
    dueDate?: string | null,
    fileSetType?: string | null,
    requiredPrefixes?: FilePrefixDto[] | null,
  ) => {
    if (!editingFolder) return;

    try {
      setIsLoading(true);

      const updatedFolder = await editFolder({
        id: editingFolder.id,
        folderName,
        lecturerUsername: assignee ?? undefined,
        dueDate: dueDate ?? undefined,
        parentFolderIds: editingFolder.parentFolderIds ?? [],
        fileSetType: fileSetType ?? undefined,
        requiredPrefixes: requiredPrefixes ?? undefined,
      });

      // Update the folder in state
      setFolders((prevFolders) =>
        prevFolders.map((f) =>
          f.id === editingFolder.id
            ? {
                ...f,
                ...updatedFolder,
                // Ensure these fields are properly updated
                fileSetType: updatedFolder.fileSetType,
                requiredPrefixesJson: updatedFolder.requiredPrefixesJson,
              }
            : f,
        ),
      );

      // If we're editing the current folder, update its name in breadcrumbs
      if (currentFolderId === editingFolder.id) {
        setBreadcrumbs((prev) =>
          prev.length > 0
            ? [
                ...prev.slice(0, -1),
                { ...prev[prev.length - 1], name: folderName },
              ]
            : prev,
        );
      }

      setEditingFolder(null);
      toast.success('Folder updated successfully');
    } catch (error) {
      console.error('Error updating folder:', error);
      toast.error('Failed to update folder');
    } finally {
      setIsLoading(false);
    }
  };

  // // Update the edit click handler
  // const handleEditClick = (folder: Folder) => {
  //   setEditingFolder(folder);
  // };

  // Enhanced handleEditClick to fetch complete folder data
  const handleEditClick = async (folder: Folder) => {
    try {
      // Fetch complete folder data including prefixes
      const response = await api.get(`/folders/${folder.id}`);
      setEditingFolder({
        ...response.data,
        // Ensure these fields exist
        fileSetType: response.data.fileSetType || null,
        requiredPrefixesJson: response.data.requiredPrefixesJson || null,
        // Maintain other existing properties
        id: folder.id,
        folderName: folder.folderName,
        lecturerUsername: folder.lecturerUsername,
        parentFolderIds: folder.parentFolderIds,
      });
    } catch (error) {
      console.error('Error fetching folder details:', error);
      // Fallback to existing data if API fails
      setEditingFolder(folder);
    }
  };

  // Delete for file and folder check
  const handleDeleteClick = (folderId: number) => {
    setSelectedFolderId(folderId);
    setDeleteTarget('folder');
    setShowDeleteModal(true);
  };

  const handleDeleteFileClick = (fileId: number) => {
    setSelectedFileId(fileId);
    setDeleteTarget('file');
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      if (deleteTarget === 'folder' && selectedFolderId !== null) {
        await deleteFolder(selectedFolderId);
        setFolders(folders.filter((f) => f.id !== selectedFolderId));
        toast.success('Folder deleted successfully.');
      } else if (deleteTarget === 'file' && selectedFileId !== null) {
        await deleteFile(selectedFileId);
        setFiles(files.filter((f) => f.id !== selectedFileId));
        toast.success('File deleted successfully.');
      }
    } catch (error) {
      console.error('Error deleting', error);
      toast.error(`Failed to delete ${deleteTarget}.`);
    } finally {
      setShowDeleteModal(false);
      setSelectedFolderId(null);
      setSelectedFileId(null);
      setDeleteTarget(null);
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
    fileSetType?: string | null,
    requiredPrefixes?: FilePrefixDto[] | null,
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
        fileSetType: fileSetType || undefined,
        requiredPrefixes: requiredPrefixes || undefined,
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

  const handleFolderClick = async (folderId: number, folderName: string) => {
    console.log('Setting current folder ID to:', folderId); // Add this
    setCurrentFolderId(folderId);
    setBreadcrumbs((prev) => [...prev, { id: folderId, name: folderName }]);
    await fetchComments(folderId);
  };

  const handleCommentClick = (folderId: number) => {
    setSelectedFolderForComment(folderId);
    setShowCommentModal(true);
  };

  const handleCommentAdded = async () => {
    if (currentFolderId) {
      await fetchComments(currentFolderId);
    }
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

  // const getFullDisplayPath = (folder: Folder) => {
  //   // Root folder case
  //   if (!folder.folderPath) return folder.folderName;

  //   // All other cases
  //   return `${folder.folderPath}/${folder.folderName}`;
  // };

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
            <Dropdown className="text-end mb-3">
              <Dropdown.Toggle
                variant="success"
                id="dropdown-create"
                disabled={isLoading || creatingFolder}
              >
                <FaPlus className="me-2" />
                {creatingFolder ? 'Creating...' : 'Create'}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Header>Folder Actions</Dropdown.Header>

                <Dropdown.Item onClick={() => setShowModal(true)}>
                  <FaFolderPlus className="me-2" />
                  Create Folder
                </Dropdown.Item>

                <Dropdown.Item onClick={() => setShowUploadModal(true)}>
                  <FaFileUpload className="me-2" />
                  Upload File
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Row>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          pauseOnHover
          draggable
        />
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
        ) : folders.length === 0 && files.length === 0 ? (
          <div className="text-center my-5">
            <FaFolderOpen size={48} className="text-muted mb-3" />
            <p>No folders found</p>
          </div>
        ) : (
          <StyledTable hover className="shadow-sm m-3">
            <thead>
              <tr>
                <th>Name</th>
                {/* /<th>Path</th>  */}
                <th>Last Modified</th>
                <th>Due Date</th>
                <th>Status</th>
                <th></th>
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
                  {/* <td>{getFullDisplayPath(folder)}</td> */}
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
                        ref={dropdownRef}
                      >
                        <div
                          className="custom-dropdown-item"
                          onClick={() => handleEditClick(folder)}
                        >
                          <FaRegEdit /> Edit
                        </div>
                        <div
                          className="custom-dropdown-item"
                          onClick={() =>
                            !loadingComments && handleCommentClick(folder.id)
                          }
                          style={
                            loadingComments
                              ? { opacity: 0.5, pointerEvents: 'none' }
                              : {}
                          }
                        >
                          {loadingComments ? (
                            <Spinner
                              animation="border"
                              size="sm"
                              className="me-2"
                            />
                          ) : (
                            <FaRegCommentDots className="me-2" />
                          )}
                          Comment
                        </div>
                        <div
                          className="custom-dropdown-item"
                          onClick={() => handleDeleteClick(folder.id)}
                        >
                          <AiOutlineDelete /> Delete
                        </div>
                        {/* <div className="custom-dropdown-item">
                          <FaShareSquare /> Share
                        </div> */}
                      </div>
                    )}
                  </td>
                </tr>
              ))}

              {/* Files */}
              {files.map((file) => (
                <tr
                  key={`file-${file.id}`}
                  className="align-middle"
                  style={{ cursor: 'pointer' }}
                  onClick={(e) => {
                    // Type cast the target to Element to access closest()
                    const target = e.target as HTMLElement;
                    if (!target.closest('.action-menu')) {
                      if (file.webViewLink) {
                        window.open(file.webViewLink, '_blank');
                      } else {
                        console.error(
                          'Web view link is not available for this file',
                        );
                      }
                    }
                  }}
                >
                  <td>
                    {getFileIcon(file.fileName)}
                    <b>{file.fileName}</b>
                  </td>
                  {/* <td>{file.filePath || '-'}</td> */}
                  <td>{new Date(file.lastModified).toLocaleDateString()}</td>
                  <td>-</td>
                  <td>
                    <Badge bg="secondary">Active</Badge>
                  </td>
                  <td className="text-end position-relative">
                    <span
                      className="text-dark p-0 border-0 cursor-pointer action-menu"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuId(
                          activeMenuId === file.id ? null : file.id,
                        );
                      }}
                    >
                      <BsThreeDotsVertical />
                    </span>
                    {activeMenuId === file.id && (
                      <div
                        className="custom-dropdown mt-2"
                        style={{ right: 0 }}
                        ref={dropdownRef}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div
                          className="custom-dropdown-item"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRenameClick(file);
                          }}
                        >
                          <FaRegEdit /> Rename
                        </div>
                        <div
                          className="custom-dropdown-item"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownloadFile(file.id, file.fileName);
                          }}
                        >
                          <FaDownload /> Download
                        </div>
                        <div
                          className="custom-dropdown-item"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteFileClick(file.id);
                          }}
                        >
                          <AiOutlineDelete /> Delete
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
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedFileId(null);
          setSelectedFolderId(null);
          setDeleteTarget(null);
        }}
        onConfirm={handleConfirmDelete}
        message={
          deleteTarget === 'folder'
            ? 'Are you sure you want to delete this folder?'
            : 'Are you sure you want to delete this file?'
        }
      />

      <EditFolderModal
        show={!!editingFolder}
        onClose={() => setEditingFolder(null)}
        onEdit={handleEditFolder}
        currentFolder={editingFolder}
        parentFolderName={
          breadcrumbs.length > 0
            ? breadcrumbs[breadcrumbs.length - 1].name
            : undefined
        }
      />

      <UploadFileModal
        show={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUploadSuccess={handleUploadSuccess}
        currentFolderId={currentFolderId}
        currentFolderName={
          breadcrumbs.length > 0
            ? breadcrumbs[breadcrumbs.length - 1].name
            : undefined
        }
      />

      <RenameFileModal
        show={showRenameModal}
        onClose={() => setShowRenameModal(false)}
        onRename={handleRenameFile}
        currentFileName={fileToRename?.fileName || ''}
      />

      <CommentModal
        show={showCommentModal}
        onClose={() => setShowCommentModal(false)}
        folderId={selectedFolderForComment || 0}
        onCommentAdded={handleCommentAdded}
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

  // /* Column width definitions */
  // th:nth-child(1),
  // td:nth-child(1) {
  //   /* Name column */
  //   width: 25%;
  //   min-width: 200px; /* Minimum width */
  // }

  // th:nth-child(2),
  // td:nth-child(2) {
  //   /* Path column */
  //   width: 30%;
  //   max-width: 0; /* Helps with text overflow */
  //   white-space: nowrap; /* Keep text on one line */
  //   overflow: hidden;
  //   text-overflow: ellipsis;
  // }

  // th:nth-child(3),
  // td:nth-child(3) {
  //   /* Last Modified */
  //   width: 15%;
  // }

  // th:nth-child(4),
  // td:nth-child(4) {
  //   /* Due Date */
  //   width: 15%;
  // }

  // th:nth-child(5),
  // td:nth-child(5) {
  //   /* Status */
  //   width: 10%;
  // }

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
    width: 160px;
    padding: 0.25rem 0;
    z-index: 1000;
  }

  .custom-dropdown-item {
    display: flex;
    align-items: center;
    padding: 0.5rem 1rem;
    cursor: pointer;
    font-size: 16px;
    color: #212529;
    transition: background-color 0.2s ease-in-out;
    white-space: nowrap;
    gap: 8px;
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
