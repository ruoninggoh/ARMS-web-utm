import Loader from '@/components/common/Loader';
import loadable from '@loadable/component';

const Academic = loadable(() => import('@/components/pages/Academic'), {
  fallback: <Loader />,
});

export default Academic;
