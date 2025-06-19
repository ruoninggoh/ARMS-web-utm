// src/utils/wrap-page-ssr-safe.tsx
import React from 'react';

const SSRWrapper = ({ element }: { element: React.ReactNode }) => {
  // If on server side, return null (do not render)
  if (typeof window === 'undefined') {
    return null;
  }

  // On client side, render normally
  return <>{element}</>;
};

export function wrapPageElement({ element }: { element: React.ReactNode }) {
  return <SSRWrapper element={element} />;
}
