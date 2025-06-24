import Loader from '@/components/common/Loader';
import loadable from '@loadable/component';

const ProfilePage = loadable(() => import('@/components/pages/Profile'), {
  fallback: <Loader />,
});

export default ProfilePage;
