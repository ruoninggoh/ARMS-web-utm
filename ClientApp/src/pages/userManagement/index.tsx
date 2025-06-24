import Loader from '@/components/common/Loader';
import loadable from '@loadable/component';

const UserManagement = loadable(
  () => import('@/components/pages/UserManagement'),
  {
    fallback: <Loader />,
  },
);

const UserManagementPage = () => {
  if (typeof window === 'undefined') return null;
  return <UserManagement />;
};

export default UserManagementPage;
