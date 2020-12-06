
const customizeConfigs = require('./src/customizeConfig.js')
const path = require('path')
const webpack = require('webpack')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin();

const customizeEnv = customizeConfigs.customizeEnv || 'bi'
function resolve(dir) {
  return path.join(__dirname, dir)
}

const customizeConfig = customizeConfigs[customizeEnv]

console.log('env',customizeConfig,customizeEnv)

const config = {
 
  // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
  productionSourceMap: false,
  runtimeCompiler: true,

  publicPath: process.env.NODE_ENV === 'production' ? '/':'/',
  
  configureWebpack: config => {
    //生产环境取消 console.log
    // if (process.env.NODE_ENV === 'production') {
    //   config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
    // }
    const plugins = [
      new BundleAnalyzerPlugin({
        analyzerMode: 'server',
        analyzerHost: '127.0.0.1',
        analyzerPort: 8888,
        reportFilename: 'report.html',
        defaultSizes: 'parsed',
        openAnalyzer: true,
        generateStatsFile: false,
        statsFilename: 'stats.json',
        logLevel: 'info'
      }),
    ]
      smp.wrap({ plugins})
  },
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@$', resolve('src'))
      .set('@api', resolve('src/api'))
      .set('@utils', resolve('src/utils'))
      .set('@mixins', resolve('src/mixins'))
      .set('@assets', resolve('src/assets'))
      .set('@comp', resolve('src/components'))
      .set('@views', resolve('src/views'))
      .set('@layout', resolve('src/layout'))
      .set('@bi', resolve('src/components/BI'))

    // 分割代码
    config.optimization.splitChunks({
      chunks: 'all'
    })

    config.plugin('define').tap(args => { 
      args[0].CUSTOMIZE_CONFIG = JSON.stringify(customizeConfig)
      args[0].CUSTOMIZE_ENV = JSON.stringify(customizeEnv)
      return args
    })
    // 配置 webpack 识别 markdown 为普通的文件
    config.module
      .rule('markdown')
      .test(/\.md$/)
      .use()
      .loader('file-loader')
      .end()
  },

  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          /* less 变量覆盖，用于自定义 ant design 主题 */
          'primary-color': customizeConfig.primaryColor,
          'link-color': customizeConfig.linkColor,
          'border-radius-base': '4px',
        },
        javascriptEnabled: true,
      }
    }
  },

  // devServer: {
  //   port: 80,
  //   proxy: {
  //     '/fts': {
  //       target: 'http://10.18.99.13:8080', //中诚信托
  //       ws: false,
  //       changeOrigin: true
  //     },
  //   }
  // },
  devServer: {
    port: 3000,
    proxy: {
      '/ftsp': {
        // target: 'http://localhost:8080', //请求本地 后台项目
        target: 'http://jzxt.one2rich.cn',
        ws: false,
        changeOrigin: true
      },
    }
  },

  lintOnSave: true
}
module.exports = config