/* eslint-disable no-unused-vars */
// gatsby-browser.tsx

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

// Gatsby's wrapPageElement API is used to wrap the entire application
export const wrapPageElement = ({ element }) => {
  return <BrowserRouter>{element}</BrowserRouter>;
};
