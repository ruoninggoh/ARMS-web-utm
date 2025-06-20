import loadable from '@loadable/component';

const UserManagement = loadable(
  () => import('@/components/pages/UserManagement'),
  {
    fallback: <p>Loading...</p>,
  },
);

const UserManagementPage = () => {
  if (typeof window === 'undefined') return null;
  return <UserManagement />;
};

export default UserManagementPage;
