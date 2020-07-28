const path = require("path")

module.exports = {
  // component-carousel
  entry: "./src/example/carousel/carousel.js",
  // component-demo
  // entry: "./src/example/component-demo/main.js",
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: [
              [
                "@babel/plugin-transform-react-jsx",
                {
                  pragma: "createElement",
                },
              ],
            ],
          },
        },
      },
      {
        test: /\.cc$/,
        use: {
          loader: require.resolve("./build/cc-loader.js"),
        },
      },
    ],
  },
  mode: "development",
  optimization: {
    minimize: false,
  },
};