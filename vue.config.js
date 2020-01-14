// gzip压缩插件
const CompressionWebpackPlugin = require('compression-webpack-plugin')

module.exports = {
  publicPath: '/dist/',
  productionSourceMap: false,
  css: {
    loaderOptions: {
      stylus: {
        'resolve url': true,
        'import': []
      }
    }
  },
  pluginOptions: {
    'cube-ui': {
      postCompile: false,
      theme: false
    },
    'vconsole': { enable: process.env.NODE_ENV === 'production' ? false : true }
  },
  // 修改webpack的配置: 如果这个值是一个对象，则会通过 webpack-merge 合并到最终的配置中。如果这个值是一个函数，则会接收被解析的配置作为参数。该函数及可以修改配置并不返回任何东西，也可以返回一个被克隆或合并过的配置版本。
  configureWebpack: config => {
    //采用cdn引入
    config.externals = {
      'vue': 'Vue',
      'vue-router': 'VueRouter',
      'vuex': 'Vuex',
      'vue-resource': 'VueResource',
      'fastclick': 'FastClick',
      'vue-lazyload': 'VueLazyload',
      // 'cube-ui': 'cube',
      'weixin-js-sdk': 'wx',
    }
    //开启gzip压缩
    const plugins = [
      new CompressionWebpackPlugin({
        filename: '[path].gz[query]',
        algorithm: 'gzip',
        test: new RegExp(
          '\\.(' +
          ['js', 'css'].join('|') +
          ')$',
        ),
        threshold: 10240,
        minRatio: 0.8,
        deleteOriginalAssets: false //.gz文件是在网络传输时候减小网络开销用的，如何请求的话在服务器配置开启gzip，请求会优先匹配同文件名的gz压缩格式返回，浏览器拿到之后会自动解压，你引用的是解压后的js或css文件
      }),
    ]
    if (process.env.NODE_ENV === 'production') {
      config.plugins = [...config.plugins, ...plugins]
    }
  },
  chainWebpack: config => {
    // 移除 prefetch 插件
    config.plugins.delete('prefetch')
  }

}