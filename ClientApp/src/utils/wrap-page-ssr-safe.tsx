import React from 'react';
import { BrowserRouter } from 'react-router-dom';

const SSRWrapper = ({ children }: { children: React.ReactNode }) => {
  if (typeof window === 'undefined') {
    return null;
  }

  return <>{children}</>;
};

export const wrapPageElement = ({ element }: { element: React.ReactNode }) => {
  return (
    <SSRWrapper>
      <BrowserRouter>{element}</BrowserRouter>
    </SSRWrapper>
  );
};
