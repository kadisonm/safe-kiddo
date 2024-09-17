const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const ENV = process.env.NODE_ENV || 'development';

console.log(`Building for Manifest Version 3`);

const plugins = [
  new CopyWebpackPlugin({
    patterns: [
      {
        from: 'src/manifest.json',
        to: path.join(__dirname, 'build'),
        force: true,
      },
    ],
  }),
  new HtmlWebpackPlugin({
    template: path.join(__dirname, 'src', 'popup', 'index.html'),
    filename: 'popup.html',
    chunks: ['popup'],
  }),
  new MiniCssExtractPlugin({
    filename: '[name].css',
  }),
  new CopyWebpackPlugin({
    patterns: [
      {
        from: "src/assets",
        to: path.join(__dirname, "build/"),
        force: true,
      },
    ],
  })
];

const options = {
  mode: ENV,
  entry: {
    popup: './src/popup/index.tsx',
    background: './src/background.ts'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'build'),
    clean: true,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env', 
              '@babel/preset-react', 
              '@babel/preset-typescript',
            ]
          },
        },
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name][ext][query]',
        },
      },
    ],
  },
  plugins: plugins,
  optimization: {
    minimize: ENV !== 'development',
    minimizer: [
      new TerserPlugin({
        extractComments: false,
      }),
    ],
  },
  infrastructureLogging: {
    level: 'info',
  },
};

if (ENV === 'development') {
  options.devtool = 'cheap-module-source-map';
}

module.exports = options;
