import Loader from '@/components/common/Loader';
import loadable from '@loadable/component';

const NotificationPage = loadable(
  () => import('@/components/pages/Notification'),
  {
    fallback: <Loader />,
  },
);

export default NotificationPage;
