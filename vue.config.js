module.exports = {

  publicPath: './',
  lintOnSave: false,
  productionSourceMap: false,//防止打包后泄漏源码
  devServer: {
    port: 11311,
    open: true,
    // overlay: {
    //   warnings: false,
    //   errors: true
    // },
    proxy: {
      '/api': {
          target: 'http://localhost:11306',
          ws: true,
          changeOrigin: true,
          logLevel: 'debug',
          pathRewrite: {
              '^/api': '/'
          }
      },
    },
  }
}
