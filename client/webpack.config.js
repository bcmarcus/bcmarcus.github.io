// const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const CircularDependencyPlugin = require('circular-dependency-plugin')

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
    ],
  },
  plugins: [
    // new HtmlWebpackPlugin({
    //   template: './index.html',
    //   filename: 'index.html',
    // }),
    new CircularDependencyPlugin({
      // `onStart` is called before the cycle detection starts
      onStart({ compilation }) {
        console.log('start detecting webpack modules cycles');
      },
      // `onDetected` is called for each module that is cyclical
      onDetected({ module: webpackModuleRecord, paths, compilation }) {
        // `paths` will be an Array of the relative module paths that make up the cycle
        // `module` will be the module record generated by webpack that caused the cycle
        compilation.errors.push(new Error(paths.join(' -> ')))
      },
      // `onEnd` is called before the cycle detection ends
      onEnd({ compilation }) {
        console.log('end detecting webpack modules cycles');
      },
    })
  ],

  devtool: 'eval-source-map',
  devServer: {
    static: {
      directory: path.join(__dirname, 'src'), // Change 'dist' to 'src'
    },
    historyApiFallback: true,
  },
};

// module.exports = (env, argv) => {
//   const isDevelopment = argv.mode === 'development';

//   return {
//     devtool: isDevelopment ? 'eval-source-map' : false,
//   };
// };