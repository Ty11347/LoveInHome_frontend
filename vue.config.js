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
      // '/api': {
      //     // 本地服务接口地址
      //     target: 'http://10.82.1.111:5000/',
      //     ws: true,
      //     logLevel: 'debug',
      //     // pathRewrite: {
      //     //     '^/dev-api': '/'
      //     // }
      // },
      // '/api': {
      //   // 本地服务接口地址
      //   target: 'http://221.193.236.253:8060/',
      //   ws: true,
      //   logLevel: 'debug',
      // pathRewrite: {
      //     '^/api': '/api'
      // }
    },
  }
}
