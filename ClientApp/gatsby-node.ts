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

export const onCreatePage: GatsbyNode['onCreatePage'] = async ({
  page,
  actions,
}) => {
  const { deletePage, createPage } = actions;

  // These MUST match your actual deployed URLs including the trailing slash
  const clientOnlyRoutes = ['/profile/', '/userManagement/', '/notification/'];

  if (clientOnlyRoutes.includes(page.path)) {
    deletePage(page);
    createPage({
      ...page,
      context: {
        ...page.context,
        ssr: false, // Disable SSR for this page
      },
    });
  }
};
