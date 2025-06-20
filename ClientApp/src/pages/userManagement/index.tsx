import loadable from '@loadable/component';

const UserManagement = loadable(
  () => import('@/components/pages/UserManagement'),
  {
    fallback: <p>Loading...</p>,
  },
);

export default UserManagement;
