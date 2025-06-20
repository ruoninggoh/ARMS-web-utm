// src/pages/ApprovalPage.tsx
import loadable from '@loadable/component';

const ApprovalPage = loadable(() => import('@/components/pages/Approval'), {
  fallback: <p>Loading...</p>,
});

export default ApprovalPage;
