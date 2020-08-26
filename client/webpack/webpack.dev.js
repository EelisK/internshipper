const { merge } = require("webpack-merge");
const base = require("./webpack.base");

module.exports = merge(base, {
  mode: "development",
  devtool: "source-map",
  devServer: {
    port: 3000,
    proxy: {
      "/jobs": {
        target: "http://localhost:8080",
        secure: false,
      },
    },
  },
});
