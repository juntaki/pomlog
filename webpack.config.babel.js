export default {
  output: {
    filename: 'counter-bundle.js',
  },
  devtool: 'source-map',
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loader: 'babel-loader',
      exclude: [/node_modules/],
    }],
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
};
