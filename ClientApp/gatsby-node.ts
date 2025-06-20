// import type { GatsbyNode } from 'gatsby';
// import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';

// export const onCreateWebpackConfig: GatsbyNode['onCreateWebpackConfig'] = ({
//   actions,
// }) => {
//   actions.setWebpackConfig({
//     resolve: {
//       plugins: [new TsconfigPathsPlugin()],
//     },
//   });
// };

import type { GatsbyNode } from 'gatsby';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';

export const onCreateWebpackConfig: GatsbyNode['onCreateWebpackConfig'] = ({
  actions,
}) => {
  actions.setWebpackConfig({
    resolve: {
      plugins: [new TsconfigPathsPlugin()],
    },
  });
};

// 👇 This is the new part that avoids the build-time crash
export const onCreatePage: GatsbyNode['onCreatePage'] = async ({
  page,
  actions,
}) => {
  const { createPage, deletePage } = actions;

  // List of pages that fail due to `document` or `window` usage
  const clientOnlyRoutes = ['/userManagement/', '/notification/'];

  if (clientOnlyRoutes.includes(page.path)) {
    deletePage(page); // Remove the original
    createPage({
      ...page,
      defer: true, // Defer rendering to runtime
    });
  }
};
