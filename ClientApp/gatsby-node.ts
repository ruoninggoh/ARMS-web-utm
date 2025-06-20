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
  stage,
  loaders,
}) => {
  actions.setWebpackConfig({
    resolve: {
      plugins: [new TsconfigPathsPlugin()],
    },
  });

  // Add this to handle Ant Design during SSR build
  if (stage === 'build-html') {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /[\\/]node_modules[\\/](antd|rc-.*)/,
            use: loaders.null(),
          },
        ],
      },
    });
  }
};

export const onCreatePage: GatsbyNode['onCreatePage'] = async ({
  page,
  actions,
}) => {
  const { deletePage, createPage } = actions;

  deletePage(page);
  createPage({
    ...page,
    context: {
      ...page.context,
      ssr: false,
    },
  });
};
