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
          target: 'https://loveinhome.herokuapp.com',
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
