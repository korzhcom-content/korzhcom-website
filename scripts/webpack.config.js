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
    path: path.resolve(__dirname, '../public/js'),
  },
  plugins: [
    new CleanWebpackPlugin({
	  protectWebpackAssets: false,
	  cleanOnceBeforeBuildPatterns: [],
      cleanAfterEveryBuildPatterns: ['*.LICENSE.txt'],
    })
  ],
  devServer: {
    static: {
      directory: path.join(path.resolve(__dirname, '../public')),
    },
    compress: false,
    port: 9000,
  },
};