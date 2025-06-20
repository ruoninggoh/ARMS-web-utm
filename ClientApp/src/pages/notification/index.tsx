import loadable from '@loadable/component';

const NotificationPage = loadable(
  () => import('@/components/pages/Notification'),
  {
    fallback: <p>Loading...</p>,
  },
);

export default NotificationPage;
