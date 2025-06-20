import loadable from '@loadable/component';

const About = loadable(() => import('@/components/pages/About'), {
  fallback: <p>Loading...</p>,
});

export default About;
