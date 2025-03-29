import { createFolder } from '@/apis/createFolder';
import React, { useState } from 'react';
import {
  Badge,
  Button,
  Col,
  Container,
  Dropdown,
  Row,
  Table,
} from 'react-bootstrap';
import { AiOutlineDelete } from 'react-icons/ai';
import { BsThreeDotsVertical } from 'react-icons/bs';
import {
  FaFolder,
  FaPlus,
  FaRegEdit,
  FaShareSquare,
  FaUser,
} from 'react-icons/fa';
import { FaRegCommentDots } from 'react-icons/fa6';
import styled from 'styled-components';
import CreateFolderModal from './CreateFolderModal';
interface Folder {
  name: string;
  lastModified: string;
  owner: string;
  status: string;
  dueDate: string;
}

const initialFolders: Folder[] = [
  {
    name: 'Software Engineering',
    lastModified: 'April 28, 2024',
    owner: 'Husna',
    status: 'In Progress',
    dueDate: 'April 28, 2024',
  },
  {
    name: 'Bioinformatics',
    lastModified: 'April 28, 2024',
    owner: 'Husna',
    status: 'Completed',
    dueDate: 'April 28, 2024',
  },
  {
    name: 'Data Engineering',
    lastModified: 'April 28, 2024',
    owner: 'Husna',
    status: 'Pending Review',
    dueDate: 'April 28, 2024',
  },
  {
    name: 'Computer Network and Security',
    lastModified: 'April 28, 2024',
    owner: 'Husna',
    status: 'In Progress',
    dueDate: 'April 28, 2024',
  },
  {
    name: 'Graphics and Multimedia Software',
    lastModified: 'April 28, 2024',
    owner: 'Husna',
    status: 'Not Started',
    dueDate: 'April 28, 2024',
  },
];

const FolderList: React.FC = () => {
  const [folders, setFolders] = useState<Folder[]>(initialFolders);
  const [showModal, setShowModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const handleCloseModal = () => setShowModal(false);

  const handleCreateFolder = async () => {
    if (newFolderName.trim() === '') return;

    // Call the backend API to create the folder in Google Drive
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
      const response = await createFolder(newFolderName);
      const newFolder: Folder = {
        name: newFolderName,
        lastModified: new Date().toLocaleDateString(),
        owner: 'Current User', // Replace with actual user info
        status: 'Not Started',
        dueDate: '01/12/2025',
      };
      setFolders([...folders, newFolder]);
      setNewFolderName('');
      setShowModal(false);
    } catch (error) {
      console.error('Error creating folder:', error);
      // Handle error (e.g., show notification to the user)
    }
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
            >
              <FaPlus className="me-2" /> Create Folder
            </Button>
          </Col>
        </Row>

        {/* Folder List Table */}
        <StyledTable hover className="shadow-sm m-3">
          <thead>
            <tr>
              <th>Name</th>
              <th>Last Modified</th>
              <th>Owner</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {folders.map((folder, index) => (
              <tr key={index} className="align-middle">
                <td>
                  <FaFolder className="text-warning me-2 align-icon" />
                  <b>{folder.name}</b>
                </td>
                <td>{folder.lastModified}</td>
                <td>
                  <FaUser className="text-secondary me-1" /> {folder.owner}
                </td>
                <td>
                  <Badge bg="secondary">{folder.status}</Badge>
                </td>
                <td className="text-end">
                  <Dropdown>
                    <Dropdown.Toggle
                      as="span"
                      className="text-dark p-0 border-0 cursor-pointer"
                    >
                      <BsThreeDotsVertical />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item>
                        <FaRegEdit className="me-2 align-icon" /> Edit
                      </Dropdown.Item>
                      <Dropdown.Item>
                        <FaRegCommentDots className=" me-2 align-icon" />{' '}
                        Comment
                      </Dropdown.Item>
                      <Dropdown.Item>
                        <AiOutlineDelete className=" me-2 align-icon" />
                        Delete
                      </Dropdown.Item>
                      <Dropdown.Item>
                        <FaShareSquare className=" me-2 align-icon" />
                        Share
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </td>
              </tr>
            ))}
          </tbody>
        </StyledTable>
      </MainContent>

      {/* Create Folder Modal */}
      <CreateFolderModal
        show={showModal}
        onClose={handleCloseModal}
        onCreate={handleCreateFolder}
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
`;
