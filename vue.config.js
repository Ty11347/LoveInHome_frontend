module.exports = {

  publicPath: './',
  lintOnSave: false,
  productionSourceMap: false,//防止打包后泄漏源码
  devServer: {
    port: 3000,
    open: true,
    // overlay: {
    //   warnings: false,
    //   errors: true
    // },
    proxy: {
      '/api': {
          target: 'http://localhost:8080/',
          ws: true,
          logLevel: 'debug',
          // pathRewrite: {
          //     '^/dev-api': '/'
          // }
      },
    },
  }
}
