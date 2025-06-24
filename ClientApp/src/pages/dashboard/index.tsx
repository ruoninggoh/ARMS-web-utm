import Loader from '@/components/common/Loader';
import loadable from '@loadable/component';

const DashboardPage = loadable(() => import('@/components/pages/Dashboard'), {
  fallback: <Loader />,
});

export default DashboardPage;
