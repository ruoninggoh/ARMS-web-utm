import {
  approveStage,
  createApprovalProgress,
  getApprovalProgress,
  getDeputyDeans,
  getHeadsOfDepartment,
  updateApprovalProgress,
} from '@/apis/approval';
import { getTopLevelFolders } from '@/apis/folder';
import { ApprovalStage } from '@/enums/ApprovalStage';
import { ApprovalProgressDto } from '@/types/Approval/ApprovalProgressDto';
import { CreateApprovalProgressRequest } from '@/types/Approval/CreateApprovalProgressRequest';
import { User } from '@/types/User/User';
import { Button, DatePicker, message, Modal, Select } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';

import { getUser } from '@/apis/auth';
import styled from 'styled-components';
import ApprovalProgress from './ApprovalProgress';

const { Option } = Select;

const ApprovalManagement: React.FC = () => {
  const [folders, setFolders] = useState<any[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [semesterCompletionDate, setSemesterCompletionDate] = useState<
    string | null
  >(null);
  const [headOfDepartmentUsernames, setHeadOfDepartmentUsernames] = useState<
    string[]
  >([]);
  const [deputyDeanUsernames, setDeputyDeanUsernames] = useState<string[]>([]);
  const [approvalProgress, setApprovalProgress] =
    useState<ApprovalProgressDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [headUsers, setHeadUsers] = useState<User[]>([]);
  const [deputyDeanUsers, setDeputyDeanUsers] = useState<User[]>([]);

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const user = getUser();
    if (user) {
      setIsAdmin(user.roles.includes('Admin'));
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [foldersData, heads, deputies] = await Promise.all([
          getTopLevelFolders(),
          getHeadsOfDepartment(),
          getDeputyDeans(),
        ]);
        setFolders(foldersData);
        setHeadUsers(heads);
        setDeputyDeanUsers(deputies);
      } catch (error) {
        message.error('Failed to fetch folders or users');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedFolder) fetchApprovalProgress(selectedFolder);
  }, [selectedFolder]);

  const fetchApprovalProgress = async (folderId: string) => {
    try {
      setLoading(true);
      const progress = await getApprovalProgress(parseInt(folderId));

      // Handle case where no approval flow exists
      if ((progress as any).Exists === false) {
        setApprovalProgress(null);
        setIsEditing(false);
        return;
      }

      // Update all relevant state
      setApprovalProgress(progress);
      setIsEditing(true);
      setSemesterCompletionDate(progress.semesterCompletionDate || null);
      setHeadOfDepartmentUsernames(
        progress.approvers
          .filter((a) => a.stage === ApprovalStage.HeadOfDepartment)
          .map((a) => a.userName),
      );
      setDeputyDeanUsernames(
        progress.approvers
          .filter((a) => a.stage === ApprovalStage.DeputyDean)
          .map((a) => a.userName),
      );
    } catch (error) {
      console.error('Error fetching approval progress:', error);
      setApprovalProgress(null);
      setIsEditing(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedFolder) return;

    if (!semesterCompletionDate) {
      message.error('Semester completion date is required');
    }

    if (headOfDepartmentUsernames.length === 0) {
      message.error('Please select at least one Head of Department approver');
      return;
    }

    if (deputyDeanUsernames.length === 0) {
      message.error('Please select at least one Deputy Dean approver');
      return;
    }

    try {
      setLoading(true);
      const data: CreateApprovalProgressRequest = {
        folderId: parseInt(selectedFolder),
        semesterCompletionDate: semesterCompletionDate ?? undefined,
        headOfDepartmentIds: headOfDepartmentUsernames,
        deputyDeanIds: deputyDeanUsernames,
      };

      // Save the approval progress
      const result = isEditing
        ? await updateApprovalProgress(data)
        : await createApprovalProgress(data);

      // Immediately update the local state with the new data
      setApprovalProgress(result);

      // If this was a new approval flow, update the editing state
      if (!isEditing) {
        setIsEditing(true);
      }

      message.success(
        isEditing ? 'Updated successfully' : 'Created successfully',
      );
      setModalVisible(false);

      // Optionally: Fetch the latest data from server to ensure consistency
      await fetchApprovalProgress(selectedFolder);
    } catch {
      message.error('Failed to save');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedFolder) return;
    try {
      setLoading(true);
      await approveStage(parseInt(selectedFolder));
      const progress = await getApprovalProgress(parseInt(selectedFolder));
      setApprovalProgress(progress);
      message.success('Stage approved successfully');
    } catch {
      message.error('Approval failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <FormContainer>
        <FormItem>
          <label>Select Semester:</label>
          <Select
            value={selectedFolder}
            onChange={setSelectedFolder}
            style={{ width: '100%' }}
            placeholder="Select a folder"
          >
            {folders.map((folder) => (
              <Option key={folder.id} value={folder.id.toString()}>
                {folder.folderName}
              </Option>
            ))}
          </Select>
        </FormItem>

        {selectedFolder && isAdmin && (
          <Button
            type="primary"
            onClick={() => {
              if (!isEditing) {
                setSemesterCompletionDate(null);
                setHeadOfDepartmentUsernames([]);
                setDeputyDeanUsernames([]);
              }
              setModalVisible(true);
            }}
          >
            {isEditing ? 'Edit Approval Flow' : 'Configure Approval Flow'}
          </Button>
        )}
      </FormContainer>

      {isAdmin && (
        <Modal
          title={isEditing ? 'Edit Approval Flow' : 'Configure Approval Flow'}
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          onOk={handleSave}
          confirmLoading={loading}
        >
          <FormItem>
            <label>Semester Completion Date:</label>
            <DatePicker
              value={
                semesterCompletionDate ? dayjs(semesterCompletionDate) : null
              }
              onChange={(date) =>
                setSemesterCompletionDate(date?.toISOString() || null)
              }
              style={{ width: '100%' }}
            />
          </FormItem>

          <FormItem>
            <label>Head of Department Approvers:</label>
            <Select
              mode="multiple"
              value={headOfDepartmentUsernames}
              onChange={setHeadOfDepartmentUsernames}
              style={{ width: '100%' }}
              placeholder="Select approvers"
            >
              {headUsers.map((user) => (
                <Option key={user.utmid} value={user.userName || user.email}>
                  {user.userName || user.email}
                </Option>
              ))}
            </Select>
          </FormItem>

          <FormItem>
            <label>Deputy Dean Approvers:</label>
            <Select
              mode="multiple"
              value={deputyDeanUsernames}
              onChange={setDeputyDeanUsernames}
              style={{ width: '100%' }}
              placeholder="Select approvers"
            >
              {deputyDeanUsers.map((user) => (
                <Option key={user.utmid} value={user.userName || user.email}>
                  {user.userName || user.email}
                </Option>
              ))}
            </Select>
          </FormItem>
        </Modal>
      )}

      {approvalProgress && (
        <ProgressContainer>
          <ApprovalProgress
            approvalProgress={approvalProgress}
            onApprove={handleApprove}
            isLoading={loading}
          />
        </ProgressContainer>
      )}
    </Container>
  );
};

export default ApprovalManagement;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem;
  max-width: 1500px;
  width: 100%;
  margin: 0 auto;
`;

const FormContainer = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const FormItem = styled.div`
  margin-bottom: 1.5rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }
`;

const ProgressContainer = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;
