import loadable from '@loadable/component';

const Academic = loadable(() => import('@/components/pages/Academic'), {
  fallback: <p>Loading...</p>,
});

export default Academic;
