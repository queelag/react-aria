const path = require('path')

module.exports = {
  addons: ['@storybook/addon-a11y', '@storybook/addon-actions', '@storybook/addon-docs', '@storybook/addon-essentials', '@storybook/addon-links'],
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  webpackFinal: async (config) => {
    config.module.rules.push({
      test: /\.css$/,
      use: [
        {
          loader: 'postcss-loader',
          options: {
            postcssOptions: {
              ident: 'postcss',
              plugins: [require('tailwindcss'), require('autoprefixer')]
            }
          }
        }
      ],
      include: path.resolve(__dirname, '../')
    })
    return config
  }
}
