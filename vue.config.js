const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  lintOnSave:false,
  transpileDependencies: [
    'vuetify'
  ]
})
module.exports={
  pages:{
    index:{
      //入口
      entry:"src/main.js"
    }
  },
  //开启代理服务器（方式一）
  // devServer: {
  //   proxy: 'http://localhost:5000'
  // }
  //开启代理服务器（方式一）
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:80',
        pathRewrite:{'^/api':''},
        ws: true, //用于支持websocket
        changeOrigin: true //用于控制请求头中的host值
      }
    }
}
}

