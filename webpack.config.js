module.exports = [
  {
    entry: './src/ui/ww-handler.js',
    output: { filename: 'ww.js', path: __dirname + '/dist' },
    resolve: {
      extensions: ['.js']
    },
  },
  {
    entry: './src/ui/index.js',
    output: { filename: 'ui.js', path: __dirname + '/dist' },
    watch: true,
    resolve: {
      extensions: ['.js']
    },
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.js$/,
          exclude: [/node_modules/, /dist/],
          use: {
            loader: "babel-loader"
          }
        }
      ]
    },
  }
];