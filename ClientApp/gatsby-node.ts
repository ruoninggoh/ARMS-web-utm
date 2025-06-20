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

// 👇 Exclude specific routes like /profile from SSR
export const onCreatePage: GatsbyNode['onCreatePage'] = async ({
  page,
  actions,
}) => {
  const { deletePage, createPage } = actions;

  // List of client-only routes that rely on browser-only APIs
  const clientOnlyPaths = ['/profile', '/userManagement', '/notification'];

  if (clientOnlyPaths.includes(page.path)) {
    deletePage(page);

    createPage({
      ...page,
      context: {
        ...page.context,
        // This disables SSR for this route
        ssr: false,
      },
    });
  }
};
