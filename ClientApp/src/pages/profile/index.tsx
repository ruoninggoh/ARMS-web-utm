import loadable from '@loadable/component';

const ProfilePage = loadable(() => import('@/components/pages/Profile'), {
  fallback: <p>Loading...</p>,
});

export default ProfilePage;
