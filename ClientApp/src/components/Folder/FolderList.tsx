import apiClient from '@/apis/api';
import { getUser } from '@/apis/auth';
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
import { usePageRedirection } from '@/hooks/usePageRedirection';
import DashboardPic from '@/images/dashboard/UTM-image.jpg';
import { CommentDto } from '@/types/Comment/Comment';
import { File } from '@/types/File/file';
import { FilePrefixDto } from '@/types/FileSet/FilePrefixDto';
import { Folder, StatusItem } from '@/types/Folder/folder';
import React, { useEffect, useRef, useState } from 'react';
import {
  Badge,
  Breadcrumb,
  Button,
  Col,
  Container,
  Dropdown,
  Form,
  Overlay,
  Row,
  Spinner,
  Table,
} from 'react-bootstrap';
import { CheckCircleFill, ExclamationCircleFill } from 'react-bootstrap-icons';
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

interface FolderListProps {
  showWelcome?: boolean;
}

const FolderList: React.FC<FolderListProps> = ({ showWelcome = false }) => {
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

  // top-level folder dropdown
  const [showSemesterModal, setShowSemesterModal] = useState(false);
  const [topLevelFolders, setTopLevelFolders] = useState<Folder[]>([]);
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const user = getUser();
    if (user) {
      setIsAdmin(user.roles.includes('Admin'));
    }
  }, []);

  // Fetch top-level folders
  useEffect(() => {
    const fetchTopLevelFolders = async () => {
      try {
        const response = await apiClient.get('/folders/top-level');
        const data = response.data;
        setTopLevelFolders(data);
        if (data.length > 0) {
          setSelectedSemester(data[0].id);
          setCurrentFolderId(data[0].id);
        }
      } catch (error) {
        console.error('Error fetching top-level folders:', error);
      }
    };
    fetchTopLevelFolders();
  }, []);

  // Handle semester selection
  const handleSemesterChange = (folderId: number) => {
    setSelectedSemester(folderId);
    setCurrentFolderId(folderId);
    setBreadcrumbs([
      {
        id: folderId,
        name: topLevelFolders.find((f) => f.id === folderId)?.folderName || '',
      },
    ]);
  };

  // Create semester handler (admin only)
  const handleCreateSemester = async (
    folderName: string,
    lecturerUsername: string,
    dueDate: string,
  ) => {
    try {
      const response = await apiClient.post('/folders/create-semester', {
        folderName,
        lecturerUsername,
        dueDate,
      });
      setTopLevelFolders([...topLevelFolders, response.data]);
      toast.success('Folder created successfully');
    } catch (error) {
      console.error('Error creating folder:', error);
      toast.error('Failed to create folder');
    }
  };

  // Update your useEffect:
  useEffect(() => {
    const fetchFolders = async () => {
      setIsLoading(true);
      try {
        const data = await getNestedFolders(currentFolderId ?? undefined);
        setFolders(data);
        // Remove the fetchFolderStatuses call since status is already included
      } catch (error) {
        console.error('Error fetching folders:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFolders();
  }, [currentFolderId]);

  interface FolderStatusBadgeProps {
    folder: Folder; // Changed from FolderWithStatus to Folder
  }
  const FolderStatusBadge: React.FC<FolderStatusBadgeProps> = ({ folder }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const targetRef = useRef<HTMLDivElement>(null);

    // Case 3: No requirements at all
    if (!folder.hasRequirements) {
      return null;
    }

    // Case 1: Folder has direct requirements
    if (folder.hasDirectRequirements) {
      const isComplete = folder.uploadedCount === folder.totalRequired;
      const statusText = `[${folder.uploadedCount}/${folder.totalRequired}]`;

      return (
        <div
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          style={{ display: 'inline-block', position: 'relative' }}
        >
          <StatusBadge
            ref={targetRef}
            bg={isComplete ? 'success' : 'warning'}
            style={{ cursor: 'pointer' }}
          >
            {statusText}
          </StatusBadge>

          {folder.statusItems && folder.statusItems.length > 0 && (
            <Overlay
              target={targetRef.current}
              show={showTooltip}
              placement="top"
            >
              {({ show: _show, ...props }) => (
                <CustomTooltip {...props}>
                  <div className="tooltip-header">Document Upload Status</div>
                  <div className="tooltip-subheader">
                    Please name your files according to the required prefix
                    format.
                  </div>
                  {folder.statusItems?.map((item: StatusItem) => {
                    const isMissing = folder.missingPrefixes?.includes(
                      item.prefix,
                    );
                    return (
                      <div key={item.prefix} className="prefix-item">
                        <div className="prefix-icon">
                          {isMissing ? (
                            <ExclamationCircleFill color="orange" size={14} />
                          ) : (
                            <CheckCircleFill color="green" size={14} />
                          )}
                        </div>
                        <div className="prefix-content">
                          <div className="prefix-name">{item.prefix}</div>
                          {item.example && (
                            <div className="prefix-example">
                              <small>Example: </small>
                              <code>{item.example}</code>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </CustomTooltip>
              )}
            </Overlay>
          )}
        </div>
      );
    }

    // Case 2: Only subfolders have requirements (show percentage)
    const roundedPercentage = Math.round(folder.completionPercentage);
    return (
      <StatusBadge bg={roundedPercentage === 100 ? 'success' : 'warning'}>
        {roundedPercentage}%
      </StatusBadge>
    );
  };

  // Comment
  const fetchComments = async (folderId: number) => {
    try {
      setLoadingComments(true);
      const commentsData = await getCommentsByFolder(folderId);
      setComments(commentsData);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleUploadSuccess = async () => {
    try {
      if (currentFolderId !== null) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const files = await getFilesByFolder(currentFolderId);
        setFiles(files);

        // Refresh the entire folder list instead of just statuses
        const data = await getNestedFolders(currentFolderId ?? undefined);
        setFolders(data);

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

      // Refresh status for ALL visible folders by refetching the entire list
      const data = await getNestedFolders(currentFolderId ?? undefined);
      setFolders(data);

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
    } catch (error: any) {
      console.error('Error updating folder:', error);
      toast.error(error.message || 'Failed to update folder');
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced handleEditClick to fetch complete folder data
  const handleEditClick = async (folder: Folder) => {
    try {
      // Fetch complete folder data including prefixes
      const response = await apiClient.get(`/folders/${folder.id}`);
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

  const user = getUser();
  const redirect = usePageRedirection();

  console.log('Retrieved user:', user); // Check if user data is correctly retrieved
  console.log(localStorage.getItem('user'));
  useEffect(() => {
    if (!user) {
      console.log('no user');

      redirect('login');
    }
  }, [redirect, user]);
  if (!user) return null; // Prevent UI flicker before redirect

  return (
    <Container className="mt-4 mb-5">
      <MainContent>
        {showWelcome && (
          <>
            <div className="mb-4">
              <h4>Hi, {user?.userName || 'User'}</h4>
            </div>
            <Banner>
              <BannerText>
                Welcome to Academic Resource Management System
              </BannerText>
            </Banner>
          </>
        )}
        <Row className="mb-4">
          <Col md={8} className="d-flex align-items-center">
            <Form.Label className="me-2 mb-0">Semester: </Form.Label>
            <Dropdown>
              <Dropdown.Toggle variant="outline-primary" id="semester-dropdown">
                {selectedSemester
                  ? topLevelFolders.find((f) => f.id === selectedSemester)
                      ?.folderName
                  : 'Select Semester'}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {topLevelFolders.map((folder) => (
                  <Dropdown.Item
                    key={folder.id}
                    onClick={() => handleSemesterChange(folder.id)}
                    active={selectedSemester === folder.id}
                  >
                    {folder.folderName}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>

            {/* Add New Semester Button (Admin only) */}
            {isAdmin && (
              <Button
                variant="success"
                className="ms-3"
                onClick={() => setShowSemesterModal(true)}
              >
                <FaPlus className="me-2" />
                Add New Semester
              </Button>
            )}
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
                <th>Assigned To</th>
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
                  <td>{folder.lecturerUsername}</td>
                  <td>
                    {folder.dueDate
                      ? new Date(folder.dueDate).toLocaleDateString()
                      : '-'}
                  </td>

                  <td>
                    <FolderStatusBadge folder={folder} />
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
                  <td>{new Date(file.lastModified).toLocaleDateString()}</td>
                  <td>-</td>
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
      {/* For creating semesters */}
      <CreateFolderModal
        show={showSemesterModal}
        onClose={() => setShowSemesterModal(false)}
        onCreate={(name, assignee, dueDate) =>
          handleCreateSemester(name, assignee || '', dueDate || '')
        }
        isTopLevel={true}
      />
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
        isTopLevel={false}
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
        isTopLevel={topLevelFolders.some(
          (folder) => folder.id === editingFolder?.id,
        )}
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
  margin-bottom: 250px;
`;

const Banner = styled.div`
  background: url(${DashboardPic}) center/cover no-repeat;

  text-align: center;
  color: white;
  padding: 80px 20px;
  border-radius: 15px;
  margin-bottom: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const BannerText = styled.h1`
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 15px;
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

const StatusBadge = styled(Badge)`
  cursor: ${(props) => (props.bg === 'secondary' ? 'default' : 'help')};
  min-width: 50px;
  display: inline-block;
  text-align: center;
  padding: 5px 8px;
  font-size: 0.85rem;
`;

const CustomTooltip = styled.div`
  background-color: #eaefef;
  padding: 12px;
  border-radius: 6px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  max-width: 350px;
  max-height: 300px;
  overflow-y: auto;
  color: #333;
  z-index: 9999;

  .tooltip-header {
    font-weight: bold;
    margin-bottom: 8px;
    font-size: 1.2rem;
    color: #333446;
  }

  .tooltip-subheader {
    font-size: 15px;
    margin-bottom: 10px;
    color: #666;
  }

  .prefix-item {
    margin-bottom: 8px;
    display: flex;
    align-items: flex-start;
  }

  .prefix-icon {
    margin-right: 8px;
    margin-top: 2px;
    flex-shrink: 0;
  }

  .prefix-content {
    flex-grow: 1;
  }

  .prefix-name {
    font-weight: 500;
  }

  .prefix-example {
    color: #666;
    font-size: 0.8rem;
    margin-top: 2px;
    font-family: monospace;
    background-color: #f5f5f5;
    padding: 2px 4px;
    border-radius: 3px;
    display: inline-block;
  }
`;
