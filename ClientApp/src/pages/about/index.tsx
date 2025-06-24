import Loader from '@/components/common/Loader';
import loadable from '@loadable/component';

const About = loadable(() => import('@/components/pages/About'), {
  fallback: <Loader />,
});

export default About;
