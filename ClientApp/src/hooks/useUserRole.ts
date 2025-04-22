import { fetchUserProfile } from '@/apis/profile';
import { useEffect, useState } from 'react';

export const useUserRole = () => {
  const [role, setRole] = useState<string>('');

  useEffect(() => {
    const loadRole = async () => {
      try {
        const profileData = await fetchUserProfile();
        setRole(profileData.role?.toLowerCase() || '');
      } catch (error) {
        console.error('Failed to fetch user role', error);
      }
    };
    loadRole();
  }, []);
  return role;
};
