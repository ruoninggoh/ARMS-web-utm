import React from 'react';

interface Props {
  src: string;
  onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isEditable: boolean;
}

const ProfilePicture: React.FC<Props> = ({
  src,
  onImageChange,
  isEditable,
}) => (
  <div className="text-center">
    <img
      src={src}
      alt="Profile"
      className="rounded-circle"
      style={{ width: '150px', height: '150px', objectFit: 'cover' }}
    />
    {isEditable && (
      <div className="mt-2">
        <input type="file" onChange={onImageChange} className="form-control" />
      </div>
    )}
  </div>
);

export default ProfilePicture;
