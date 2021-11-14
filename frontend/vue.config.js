const { DefinePlugin } = require("webpack");

module.exports = {
  transpileDependencies: ["vuetify"],

  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        pathRewrite: {
          "^/api": "",
        },
      },
    },
  },

  configureWebpack: {
    plugins: [
      new DefinePlugin({
        RPC_URL: `"${process.env.RPC_URL || "HTTP://127.0.0.1:7545"}"`,
      }),
    ],
  },
};
