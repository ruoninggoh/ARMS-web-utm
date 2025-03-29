import React from 'react';

interface Props {
  label: string;
  name: string;
  value: string;
  isEditable: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const EditableField: React.FC<Props> = ({
  label,
  name,
  value,
  isEditable,
  onChange,
}) => (
  <div className="mb-3">
    <label htmlFor={name} className="form-label">
      {label}
    </label>
    <input
      type="text"
      className="form-control"
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      disabled={!isEditable}
    />
  </div>
);

export default EditableField;
