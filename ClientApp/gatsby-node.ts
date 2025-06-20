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
export const onCreatePage = async ({ page, actions }) => {
  const { deletePage, createPage } = actions;

  const clientOnlyRoutes = [
    '/userManagement/',
    '/profile/',
    '/notification/',
    '/dashboard/',
  ];

  if (clientOnlyRoutes.includes(page.path)) {
    deletePage(page);
    createPage({
      ...page,
      context: {
        ...page.context,
        ssr: false,
      },
    });
  }
};
