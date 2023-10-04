const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: './scripts/src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    library: {
      name: 'GAZDA_CLIENT',
      type: 'var'
    },
    filename: 'app-client.min.js',
    path: path.resolve(__dirname, '../source/js'),
  },
  plugins: [
    new CleanWebpackPlugin({
	  protectWebpackAssets: false,
	  cleanOnceBeforeBuildPatterns: [],
      cleanAfterEveryBuildPatterns: ['*.LICENSE.txt'],
    })
  ],
  devServer: {
    historyApiFallback: {
      rewrites: [
        { from: /^\/$/, to: '/index.html' },
        { from: /^\/metroui/, to: '/metroui.html' },
        { from: /^\/localizer/, to: '/localizer.html' },
        { from: /^\/easyquery/, to: '/easyquery.html' },
        { from: /^\/easy-report-starter-kit/, to: '/easy-report-starter-kit.html' },
        { from: /./, to: '/404.html' },
      ],
    },
    static: {
      directory: path.join(path.resolve(__dirname, '../source')),
    },
    compress: false,
    port: 9000,
  },
};