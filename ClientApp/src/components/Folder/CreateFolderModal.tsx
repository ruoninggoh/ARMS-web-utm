import {
  getAssigneeList,
  getFileSetRequirements,
  getFileSets,
} from '@/apis/folder';
import { FilePrefixDto } from '@/types/FileSet/FilePrefixDto';
import { User } from '@/types/User/User';
import React, { useEffect, useState } from 'react';
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

interface CreateFolderModalProps {
  show: boolean;
  onClose: () => void;
  onCreate: (
    folderName: string,
    assignee?: string | null,
    dueDate?: string | null,
    fileSetType?: string | null,
    requiredPrefixes?: FilePrefixDto[] | null,
  ) => void;
  currentFolderName?: string;
  currentFolderId?: number | null;
}

interface FormData {
  folderName: string;
  assignee?: string;
  dueDate?: string;
  enablePrefixRequirements: boolean;
  fileSet: string;
  requiredPrefixes: FilePrefixDto[];
  newPrefix: string;
  newDisplayName: string;
}

interface FileSetInfo {
  key: string;
  label: string;
  requirements: FilePrefixDto[];
}

const CreateFolderModal: React.FC<CreateFolderModalProps> = ({
  show,
  onClose,
  onCreate,
  currentFolderName,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FormData>({
    defaultValues: {
      enablePrefixRequirements: false,
      fileSet: '',
      requiredPrefixes: [],
      newPrefix: '',
      newDisplayName: '',
    },
  });

  const [creatingFolder, setCreatingFolder] = useState(false);
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

  useEffect(() => {
    if (enablePrefixRequirements) {
      setAccordionKey('0');
    } else {
      setAccordionKey(null);
      setValue('requiredPrefixes', []);
    }
  }, [enablePrefixRequirements, setValue]);

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
          if (fileSetsData.length > 0) {
            setValue('fileSet', fileSetsData[0].key);
          }
        } catch (error) {
          console.error('Failed to fetch data:', error);
        } finally {
          setLoadingUsers(false);
          setLoadingFileSets(false);
        }
      };
      fetchData();
      reset();
    }
  }, [show, reset, setValue]);

  useEffect(() => {
    if (enablePrefixRequirements && selectedFileSet) {
      const fetchRequirements = async () => {
        try {
          const requirements = await getFileSetRequirements(selectedFileSet);
          setValue(
            'requiredPrefixes',
            requirements.map((req) => ({ ...req, isSelected: true })),
          );
        } catch (error) {
          console.error('Failed to fetch requirements:', error);
        }
      };
      fetchRequirements();
    }
  }, [selectedFileSet, enablePrefixRequirements, setValue]);

  const getAllRequirements = () => {
    const selectedSet = fileSets.find((set) => set.key === selectedFileSet);

    // Get only the requirements from the selected file set
    const baseRequirements =
      selectedSet?.requirements.map((req) => {
        const existingPrefix = requiredPrefixes.find(
          (p) => p.prefix === req.prefix,
        );
        return {
          ...req,
          isCustom: false,
          isSelected: existingPrefix
            ? existingPrefix.isSelected !== false
            : true,
        };
      }) || [];

    // Get custom prefixes that aren't in the selected file set
    const customRequirements = requiredPrefixes
      .filter(
        (prefixObj) =>
          !baseRequirements.some((r) => r.prefix === prefixObj.prefix),
      )
      .map((prefixObj) => ({
        ...prefixObj,
        example: `${prefixObj.prefix}${prefixObj.displayName.replace(
          /\s+/g,
          '',
        )}`,
        isCustom: true,
      }));

    return [...baseRequirements, ...customRequirements];
  };
  // Add state for validation errors
  const [prefixErrors, setPrefixErrors] = useState({
    prefix: '',
    displayName: '',
  });

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
      !requiredPrefixes.some((p) => p.prefix === newPrefix)
    ) {
      setValue('requiredPrefixes', [
        ...requiredPrefixes,
        {
          prefix: newPrefix,
          displayName: newDisplayName,
          isSelected: true, // Auto-select new prefixes
        },
      ]);
      setValue('newPrefix', '');
      setValue('newDisplayName', '');
      setPrefixErrors({ prefix: '', displayName: '' });
    }
  };

  // Update the prefix selection toggle

  const togglePrefixSelection = (prefix: string, isCustom: boolean) => {
    if (isCustom) {
      // For custom prefixes - remove completely when unchecked
      const newPrefixes = requiredPrefixes.filter((p) => p.prefix !== prefix);
      setValue('requiredPrefixes', newPrefixes);
    } else {
      // For default prefixes - toggle selection state
      const existingPrefix = requiredPrefixes.find((p) => p.prefix === prefix);

      if (existingPrefix) {
        // If exists, toggle its isSelected state
        const newPrefixes = requiredPrefixes.map((p) =>
          p.prefix === prefix ? { ...p, isSelected: !p.isSelected } : p,
        );
        setValue('requiredPrefixes', newPrefixes);
      } else {
        // If doesn't exist, add it as unselected
        const defaultPrefix = fileSets
          .flatMap((set) => set.requirements)
          .find((req) => req.prefix === prefix);

        if (defaultPrefix) {
          setValue('requiredPrefixes', [
            ...requiredPrefixes,
            { ...defaultPrefix, isSelected: false },
          ]);
        }
      }
    }
  };

  const onSubmit = async (data: FormData) => {
    const formattedDate = data.dueDate
      ? new Date(data.dueDate).toISOString()
      : null;

    // Merge default prefixes (from selected file set) with current requiredPrefixes
    const selectedSet = fileSets.find((set) => set.key === data.fileSet);
    const baseRequirements = selectedSet?.requirements || [];

    const mergedPrefixes: FilePrefixDto[] = [
      ...baseRequirements.map((req) => {
        const matching = data.requiredPrefixes.find(
          (p) => p.prefix === req.prefix,
        );
        return {
          ...req,
          isSelected: matching?.isSelected !== false, // default to true if not explicitly deselected
        };
      }),
      ...data.requiredPrefixes.filter(
        (p) => !baseRequirements.some((req) => req.prefix === p.prefix),
      ),
    ];

    const selectedPrefixes = mergedPrefixes.filter(
      (p) => p.isSelected !== false,
    );

    setCreatingFolder(true);
    try {
      await onCreate(
        data.folderName,
        data.assignee === 'none' ? null : data.assignee,
        formattedDate,
        data.enablePrefixRequirements ? data.fileSet : null,
        data.enablePrefixRequirements ? selectedPrefixes : null,
      );
      reset();
      onClose();
    } finally {
      setCreatingFolder(false);
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton className="border-bottom-0 pb-0">
        <Modal.Title>Create New Folder</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          {/* Folder Basics Section */}
          <div className="mb-4">
            {currentFolderName && (
              <div className="mb-3 text-muted small">
                Location: <strong>{currentFolderName}</strong>
              </div>
            )}

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
                <Form.Control.Feedback type="invalid">
                  {errors.folderName.message}
                </Form.Control.Feedback>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Assignee</Form.Label>
              {loadingUsers ? (
                <Spinner animation="border" size="sm" />
              ) : (
                <Form.Select {...register('assignee')}>
                  <option value="none">No assignee</option>
                  {users.map((user) => (
                    <option key={user.utmid} value={user.userName}>
                      {user.userName}
                    </option>
                  ))}
                </Form.Select>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Due Date</Form.Label>
              <InputGroup>
                <Form.Control type="datetime-local" {...register('dueDate')} />
                <InputGroup.Text>
                  <FaCalendarAlt />
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>
          </div>

          {/* Prefix Requirements Section */}
          <Accordion
            activeKey={accordionKey}
            onSelect={(key) =>
              setAccordionKey(
                typeof key === 'string' || key === null ? key : null,
              )
            }
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
                    onChange={(e) =>
                      setValue('enablePrefixRequirements', e.target.checked)
                    }
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
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent event bubbling
                                togglePrefixSelection(req.prefix, req.isCustom);
                              }}
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
                                onClick={(e) => e.stopPropagation()} // Prevent double trigger
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
                                        <FaStar size={10} />{' '}
                                        {/* Small icon to indicate custom */}
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

                          {/* Separate error messages for each field */}
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

          <Modal.Footer className="border-top-0 pt-0">
            <Button
              variant="outline-secondary"
              onClick={onClose}
              disabled={creatingFolder}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={creatingFolder}>
              {creatingFolder ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    className="me-2"
                  />
                  Creating...
                </>
              ) : (
                'Create Folder'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateFolderModal;
