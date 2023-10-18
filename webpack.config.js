const path = require('path');
const fs = require('fs');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// Define the folder where your HTML files are located
const htmlFilesFolder = path.resolve(__dirname, 'src/html');

// Read the HTML files in the specified folder
const htmlFiles = fs.readdirSync(htmlFilesFolder);

const entryPoints = {};
const htmlPlugins = [];

// Generate entry points and HtmlWebpackPlugin instances
htmlFiles.forEach((filename) => {
  const entryName = path.basename(filename, '.html');
  const entryFile = `./src/js/${entryName}.js`;

  entryPoints[entryName] = entryFile;

  htmlPlugins.push(new HtmlWebpackPlugin({
    filename: `${entryName}.html`, // Output HTML file name
    template: path.join(htmlFilesFolder, filename), // Template file for this entry point
    chunks: [entryName], // Corresponding entry point name
  }));
});

module.exports = {
	entry: entryPoints,
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'public'),
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
					MiniCssExtractPlugin.loader,
          'css-loader',   // Translate CSS into CommonJS
          'sass-loader'   // Compile Sass to CSS
        ],
      },
    ],
  },
	optimization: {
    minimizer: [
      // Apply the CssMinimizerPlugin to minimize CSS
      new CssMinimizerPlugin(),
    ],
  },
  plugins: [
		new MiniCssExtractPlugin({
      filename: '[name].css', // CSS files will be saved in the "css" folder with hashed filenames for better caching.
    }),
		...htmlPlugins,
    new BrowserSyncPlugin({
      host: 'localhost',
      port: 3000,
      server: { baseDir: ['public'] },
    })
  ],
};
