import loadable from '@loadable/component';

const DashboardPage = loadable(() => import('@/components/pages/Dashboard'), {
  fallback: <p>Loading...</p>,
});

export default DashboardPage;
