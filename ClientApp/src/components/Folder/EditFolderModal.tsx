import {
  getAssigneeList,
  getFileSetRequirements,
  getFileSets,
} from '@/apis/folder';
import { FilePrefixDto } from '@/types/FileSet/FilePrefixDto';
import { Folder } from '@/types/Folder/folder';
import { User } from '@/types/User/User';
import React, { useEffect, useRef, useState } from 'react';
import {
  Accordion,
  Alert,
  Badge,
  Button,
  Form,
  FormControl,
  InputGroup,
  ListGroup,
  Modal,
  Spinner,
} from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { FaCalendarAlt, FaInfoCircle, FaPlus, FaStar } from 'react-icons/fa';
import { RxCross2 } from 'react-icons/rx';
import styled from 'styled-components';

interface EditFolderModalProps {
  show: boolean;
  onClose: () => void;
  onEdit: (
    folderName: string,
    assignee?: string | null,
    dueDate?: string | null,
    fileSetType?: string | null,
    requiredPrefixes?: FilePrefixDto[] | null,
  ) => Promise<void>;
  currentFolder: Folder | null;
  parentFolderName?: string;
}

interface FileSetInfo {
  key: string;
  label: string;
  requirements: FilePrefixDto[];
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
    watch,
  } = useForm({
    defaultValues: {
      folderName: '',
      assignee: 'none',
      dueDate: '',
      enablePrefixRequirements: false,
      fileSet: '',
      requiredPrefixes: [] as FilePrefixDto[],
      newPrefix: '',
      newDisplayName: '',
    },
  });

  const [editingFolder, setEditingFolder] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [fileSets, setFileSets] = useState<FileSetInfo[]>([]);
  const [loadingFileSets, setLoadingFileSets] = useState(false);

  const enablePrefixRequirements = watch('enablePrefixRequirements');
  const selectedFileSet = watch('fileSet');
  const requiredPrefixes = watch('requiredPrefixes');
  const newPrefix = watch('newPrefix');
  const newDisplayName = watch('newDisplayName');

  const [accordionKey, setAccordionKey] = useState<string | null>(null);
  const [prefixErrors, setPrefixErrors] = useState({
    prefix: '',
    displayName: '',
  });

  useEffect(() => {
    if (enablePrefixRequirements) {
      setAccordionKey('0');
    } else {
      setAccordionKey(null);
      // Don't reset requiredPrefixes here!
      // The user might have prefilled data.
    }
  }, [enablePrefixRequirements]);

  useEffect(() => {
    if (show) {
      const fetchData = async () => {
        setLoadingUsers(true);
        setLoadingFileSets(true);
        try {
          const [assigneeList, fileSetsData] = await Promise.all([
            getAssigneeList(),
            getFileSets(),
          ]);
          setUsers(assigneeList);
          setFileSets(fileSetsData);
        } catch (error) {
          console.error('Failed to fetch data:', error);
        } finally {
          setLoadingUsers(false);
          setLoadingFileSets(false);
        }
      };
      fetchData();
    }
  }, [show]);

  useEffect(() => {
    if (!show || !currentFolder || fileSets.length === 0) return;

    const initialPrefixes = currentFolder.requiredPrefixesJson
      ? JSON.parse(currentFolder.requiredPrefixesJson).map((p: any) => ({
          ...p,
          prefix: p.Prefix || p.prefix,
          displayName:
            p.DisplayName ||
            p.displayName ||
            (p.Prefix || p.prefix).replace('_', ''),
          example:
            p.Example ||
            p.example ||
            `${p.Prefix || p.prefix}${(p.DisplayName || p.displayName)?.replace(
              /\s+/g,
              '',
            )}`,
        }))
      : [];

    const currentFileSet = fileSets.find(
      (set) => set.key === currentFolder.fileSetType,
    );
    const fileSetRequirements = currentFileSet?.requirements || [];

    const combinedPrefixes = [
      // default matched
      ...fileSetRequirements.filter((req) =>
        initialPrefixes.some((p: FilePrefixDto) => p.prefix === req.prefix),
      ),
      // custom unmatched
      ...initialPrefixes.filter(
        (p: FilePrefixDto) =>
          !fileSetRequirements.some((req) => req.prefix === p.prefix),
      ),
    ];

    reset({
      folderName: currentFolder.folderName,
      assignee: currentFolder.lecturerUsername || 'none',
      dueDate: currentFolder.dueDate
        ? formatDateTimeLocal(currentFolder.dueDate)
        : '',
      enablePrefixRequirements:
        initialPrefixes.length > 0 || !!currentFolder.fileSetType,
      fileSet: currentFolder.fileSetType || '',
      requiredPrefixes: combinedPrefixes,
      newPrefix: '',
      newDisplayName: '',
    });
  }, [show, currentFolder, fileSets, reset]);

  const initialLoadRef = useRef(true);

  useEffect(() => {
    if (enablePrefixRequirements && selectedFileSet) {
      // Skip the first call immediately after reset
      if (initialLoadRef.current) {
        initialLoadRef.current = false;
        return;
      }

      const fetchRequirements = async () => {
        try {
          const requirements = await getFileSetRequirements(selectedFileSet);
          const currentPrefixes = requiredPrefixes || [];

          // Keep only custom prefixes when changing file sets
          const customPrefixes = currentPrefixes.filter(
            (p) => !requirements.some((r) => r.prefix === p.prefix),
          );

          // Set all file set requirements (unticked) plus any custom prefixes
          setValue('requiredPrefixes', [...customPrefixes]);
        } catch (error) {
          console.error('Failed to fetch requirements:', error);
        }
      };

      fetchRequirements();
    }
  }, [selectedFileSet, enablePrefixRequirements]);

  const getAllRequirements = () => {
    const currentFileSet = fileSets.find((set) => set.key === selectedFileSet);
    const fileSetRequirements = currentFileSet?.requirements || [];
    const savedPrefixes = requiredPrefixes || [];

    // Show all prefixes from the selected file set
    const defaultPrefixes = fileSetRequirements.map((req) => ({
      ...req,
      isCustom: false,
      isSelected: savedPrefixes.some((p) => p.prefix === req.prefix),
      example:
        req.example || `${req.prefix}${req.displayName?.replace(/\s+/g, '')}`,
    }));

    // Show custom prefixes that were saved for this folder
    const customPrefixes = savedPrefixes
      .filter((p) => !fileSetRequirements.some((r) => r.prefix === p.prefix))
      .map((p) => ({
        ...p,
        isCustom: true,
        isSelected: true,
        displayName: p.displayName || p.prefix.replace('_', ''),
        example:
          p.example || `${p.prefix}${p.displayName?.replace(/\s+/g, '')}`,
      }));

    return [...defaultPrefixes, ...customPrefixes];
  };

  const validatePrefixFields = () => {
    const errors = {
      prefix: '',
      displayName: '',
    };

    if (!newPrefix.trim()) {
      errors.prefix = 'Prefix is required';
    } else if (!newPrefix.endsWith('_')) {
      errors.prefix = 'Prefix must end with underscore (_)';
    }

    if (!newDisplayName.trim()) {
      errors.displayName = 'Display name is required';
    }

    setPrefixErrors(errors);
    return Object.values(errors).every((error) => !error);
  };

  const addCustomPrefix = () => {
    if (!validatePrefixFields()) return;

    if (
      newPrefix.trim() &&
      !requiredPrefixes?.some((p) => p.prefix === newPrefix)
    ) {
      setValue('requiredPrefixes', [
        ...(requiredPrefixes || []),
        {
          prefix: newPrefix,
          displayName: newDisplayName,
          isSelected: true,
        },
      ]);
      setValue('newPrefix', '');
      setValue('newDisplayName', '');
      setPrefixErrors({ prefix: '', displayName: '' });
    }
  };

  // const togglePrefixSelection = (prefix: string, isCustom: boolean) => {
  //   const currentPrefixes = requiredPrefixes || [];

  //   if (isCustom) {
  //     // Remove custom prefix completely
  //     setValue(
  //       'requiredPrefixes',
  //       currentPrefixes.filter((p) => p.prefix !== prefix),
  //     );
  //   } else {
  //     // Toggle default prefix
  //     const fileSet = fileSets.find((set) => set.key === selectedFileSet);
  //     const prefixDefinition = fileSet?.requirements.find(
  //       (r) => r.prefix === prefix,
  //     );

  //     if (prefixDefinition) {
  //       const exists = currentPrefixes.some((p) => p.prefix === prefix);
  //       if (exists) {
  //         // Remove if already exists
  //         setValue(
  //           'requiredPrefixes',
  //           currentPrefixes.filter((p) => p.prefix !== prefix),
  //         );
  //       } else {
  //         // Add if doesn't exist
  //         setValue('requiredPrefixes', [...currentPrefixes, prefixDefinition]);
  //       }
  //     }
  //   }
  // };

  const togglePrefixSelection = (prefix: string, isCustom: boolean) => {
    const currentPrefixes = requiredPrefixes || [];

    if (isCustom) {
      // Remove custom prefix completely
      setValue(
        'requiredPrefixes',
        currentPrefixes.filter((p) => p.prefix !== prefix),
      );
    } else {
      // Toggle default prefix
      const fileSet = fileSets.find((set) => set.key === selectedFileSet);
      const prefixDefinition = fileSet?.requirements.find(
        (r) => r.prefix === prefix,
      );

      if (prefixDefinition) {
        const exists = currentPrefixes.some((p) => p.prefix === prefix);
        if (exists) {
          // Remove if already exists
          setValue(
            'requiredPrefixes',
            currentPrefixes.filter((p) => p.prefix !== prefix),
          );
        } else {
          // Add if doesn't exist (with all required fields)
          setValue('requiredPrefixes', [
            ...currentPrefixes,
            {
              ...prefixDefinition,
              isSelected: true, // Ensure this field exists
            },
          ]);
        }
      }
    }
  };
  const onSubmit = async (data: any) => {
    const formattedDate = data.dueDate ? convertToUTC(data.dueDate) : null;

    // Get the current file set's requirements
    const currentFileSet = fileSets.find((set) => set.key === data.fileSet);
    const fileSetRequirements = currentFileSet?.requirements || [];

    // Combine selected default prefixes with custom prefixes
    const selectedPrefixes = data.enablePrefixRequirements
      ? [
          // Include default prefixes that are selected
          ...fileSetRequirements.filter((req) =>
            (data.requiredPrefixes || []).some(
              (p: any) => p.prefix === req.prefix,
            ),
          ),
          // Include all custom prefixes
          ...(data.requiredPrefixes || []).filter(
            (p: any) =>
              !fileSetRequirements.some((req) => req.prefix === p.prefix),
          ),
        ]
      : null;

    setEditingFolder(true);
    try {
      await onEdit(
        data.folderName,
        data.assignee === 'none' ? null : data.assignee,
        formattedDate,
        data.enablePrefixRequirements ? data.fileSet : null,
        selectedPrefixes,
      );
    } finally {
      setEditingFolder(false);
    }
  };

  const formatDateTimeLocal = (utcDateString: string) => {
    const date = new Date(utcDateString);
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60000);
    return localDate.toISOString().slice(0, 16);
  };

  const convertToUTC = (localDataString: string) => {
    const localDate = new Date(localDataString);
    return new Date(
      localDate.getTime() - localDate.getTimezoneOffset() * 60000,
    ).toISOString();
  };

  const handleClearError = (field: string) => {
    setValue(field, field === 'assignee' ? 'none' : '');
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
        <Form onSubmit={handleSubmit(onSubmit)}>
          {/* Folder Basics Section */}
          <div className="mb-4">
            <Form.Group className="mb-3">
              <Form.Label>Folder Name *</Form.Label>
              <Form.Control
                type="text"
                isInvalid={!!errors.folderName}
                {...register('folderName', {
                  required: 'Folder name is required',
                })}
                placeholder="Enter folder name"
              />
              {errors.folderName && (
                <ErrorWrapper>
                  <DeleteIcon onClick={() => handleClearError('folderName')} />
                  <ErrorMessage>
                    {String(errors.folderName.message)}
                  </ErrorMessage>
                </ErrorWrapper>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Assignee</Form.Label>
              {loadingUsers ? (
                <Spinner animation="border" size="sm" />
              ) : (
                <Form.Select
                  {...register('assignee')}
                  isInvalid={!!errors.assignee}
                >
                  <option value="none">No assignee</option>
                  {users.map((user) => (
                    <option key={user.utmid} value={user.userName}>
                      {user.userName}
                    </option>
                  ))}
                </Form.Select>
              )}
              {errors.assignee && (
                <ErrorWrapper>
                  <DeleteIcon onClick={() => handleClearError('assignee')} />
                  <ErrorMessage>{String(errors.assignee.message)}</ErrorMessage>
                </ErrorWrapper>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Due Date</Form.Label>
              <InputGroup>
                <Form.Control
                  type="datetime-local"
                  {...register('dueDate')}
                  isInvalid={!!errors.dueDate}
                />
                <InputGroup.Text>
                  <FaCalendarAlt />
                </InputGroup.Text>
              </InputGroup>
              {errors.dueDate && (
                <ErrorWrapper>
                  <DeleteIcon onClick={() => handleClearError('dueDate')} />
                  <ErrorMessage>{String(errors.dueDate.message)}</ErrorMessage>
                </ErrorWrapper>
              )}
            </Form.Group>
          </div>

          {/* Prefix Requirements Section */}
          <Accordion
            activeKey={accordionKey}
            onSelect={(key) => setAccordionKey(key as string)}
          >
            <Accordion.Item eventKey="0">
              <Accordion.Header>
                <div className="d-flex align-items-center">
                  <Form.Check
                    type="switch"
                    id="enable-prefix-requirements"
                    label={
                      <span className="ms-2">Checklist For Course File</span>
                    }
                    checked={enablePrefixRequirements}
                    onChange={(e) => {
                      setValue('enablePrefixRequirements', e.target.checked);
                      if (!e.target.checked) {
                        setValue('fileSet', '');
                        setValue('requiredPrefixes', []);
                      }
                    }}
                    className="pe-2"
                  />
                </div>
              </Accordion.Header>
              <Accordion.Body className="pt-3">
                {enablePrefixRequirements && (
                  <>
                    <Alert
                      variant="info"
                      className="d-flex align-items-center mb-3"
                    >
                      <FaInfoCircle className="me-2 flex-shrink-0" />
                      <span>
                        System will validate files based on these prefixes.
                      </span>
                    </Alert>

                    <Form.Group className="mb-3">
                      <Form.Label>Select Default File Set</Form.Label>
                      {loadingFileSets ? (
                        <Spinner animation="border" size="sm" />
                      ) : (
                        <Form.Select {...register('fileSet')}>
                          {fileSets.map((set) => (
                            <option key={set.key} value={set.key}>
                              {set.label}
                            </option>
                          ))}
                        </Form.Select>
                      )}
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>
                        Course File Checklist
                        <small className="text-muted ms-2">
                          (System will validate these prefixes)
                        </small>
                      </Form.Label>

                      <ListGroup
                        variant="flush"
                        className="border rounded mb-3"
                        style={{ maxHeight: '200px', overflowY: 'auto' }}
                      >
                        {getAllRequirements().map((req) => (
                          <ListGroup.Item
                            key={req.prefix}
                            className="d-flex align-items-center py-2 px-3"
                          >
                            <div
                              className="d-flex w-100 align-items-center"
                              onClick={() =>
                                togglePrefixSelection(req.prefix, req.isCustom)
                              }
                              style={{ cursor: 'pointer' }}
                            >
                              <Form.Check
                                type="checkbox"
                                id={`prefix-${req.prefix}`}
                                checked={req.isSelected}
                                onChange={() =>
                                  togglePrefixSelection(
                                    req.prefix,
                                    req.isCustom,
                                  )
                                }
                                className="me-3"
                                onClick={(e) => e.stopPropagation()}
                              />
                              <div className="flex-grow-1">
                                <div className="d-flex align-items-center">
                                  <Badge
                                    bg={req.isCustom ? 'warning' : 'info'}
                                    className="me-2"
                                  >
                                    {req.prefix}
                                    {req.isCustom && (
                                      <span className="ms-1">
                                        <FaStar size={10} />
                                      </span>
                                    )}
                                  </Badge>
                                  <span>{req.displayName}</span>
                                </div>
                                <small className="text-muted d-block mt-1">
                                  Example: {req.example}
                                </small>
                              </div>
                            </div>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>

                      <div className="mt-4">
                        <h6>Add Additional File</h6>
                        <small className="text-muted">
                          Please follow the required naming convention, such as
                          including an underscore (_) before the file name.
                        </small>

                        <div className="mb-3">
                          <InputGroup>
                            <FormControl
                              placeholder="Prefix (e.g., A1.4_)"
                              value={newPrefix}
                              onChange={(e) =>
                                setValue('newPrefix', e.target.value)
                              }
                              isInvalid={!!prefixErrors.prefix}
                            />
                            <FormControl
                              placeholder="Display name (e.g., LecturerNote)"
                              value={newDisplayName}
                              onChange={(e) =>
                                setValue('newDisplayName', e.target.value)
                              }
                              isInvalid={!!prefixErrors.displayName}
                            />
                            <Button
                              variant="outline-primary"
                              onClick={addCustomPrefix}
                              disabled={
                                !newPrefix.trim() || !newDisplayName.trim()
                              }
                            >
                              <FaPlus /> Add
                            </Button>
                          </InputGroup>

                          {prefixErrors.prefix && (
                            <div className="text-danger small mt-1">
                              {prefixErrors.prefix}
                            </div>
                          )}
                          {prefixErrors.displayName && (
                            <div className="text-danger small mt-1">
                              {prefixErrors.displayName}
                            </div>
                          )}

                          <Form.Text className="text-muted">
                            Example filename will be: {newPrefix}
                            {newDisplayName.replace(/\s+/g, '')}
                          </Form.Text>
                        </div>
                      </div>
                    </Form.Group>
                  </>
                )}
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>

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
                'Update Folder'
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
