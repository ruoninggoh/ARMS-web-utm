// src/pages/ApprovalPage.tsx
import Loader from '@/components/common/Loader';
import loadable from '@loadable/component';

const ApprovalPage = loadable(() => import('@/components/pages/Approval'), {
  fallback: <Loader />,
});

export default ApprovalPage;
