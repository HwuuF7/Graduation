module.exports = {
    // hash模式
    publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
    // history模式
    // publicPath: process.env.NODE_ENV === 'production' ? '/preview/' : '/',
    assetsDir: 'static',
    chainWebpack: config => {
        config.when(process.env.NODE_ENV === 'production',
            // 生产模式下
            config => {
                config.plugin('html').tap(args => {
                    args[0].isProd = true;
                    args[0].title = '成电翻江';
                    return args
                });
                config.set('externals', {
                    'vue': 'Vue',
                    'vue-router': 'VueRouter',
                    'vuex': 'Vuex',
                    'mint-ui': 'MINT',
                    'axios': 'axios',
                })
            },
            // 开发模式下
            config => {
                config.plugin('html').tap(args => {
                    args[0].isProd = false;
                    return args
                })
            }
        )


    }
}