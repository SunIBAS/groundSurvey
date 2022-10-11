module.exports = {
    publicPath: './',
    outputDir: 'hbuilder-app/dist',
    productionSourceMap: true,
    configureWebpack: {
        devtool: 'source-map',
        devServer: {
            disableHostCheck: true,
            open: false,
            // host: 'exmaple.com',
            port: 443,
            https: true,
            hotOnly: false,
        },
    },
    pages: {
        // index: {
        //     entry: "src/main.js",
        //     template: 'public/index.html',
        //     filename: 'index.html',
        //     chunks: ['chunk-vendors', 'chunk-common', 'index']
        // },
        index: {
            entry: "NewPetSrc/main.js",
            template: 'public/index.html',
            filename: 'index.html',
            chunks: ['chunk-vendors', 'chunk-common', 'index']
        },
        // manager: {
        //     entry: "SrcManager/main.js",
        //     template: 'public/manager.html',
        //     filename: 'manager.html',
        //     chunks: ['chunk-vendors', 'chunk-common', 'manager']
        // },
    },
    filenameHashing: true,
    devServer: {
        host: '172.20.109.222',
        port: 8081,
        // https: true,
        open: true,
        proxy: {
            // detail: https://cli.vuejs.org/config/#devserver-proxy
            '/': {
                target: `https://172.20.109.155:8080/`,
                // target: `http://localhost:801/`,
                changeOrigin: true,
                pathRewrite: {
                    ['^/']: ''
                }
            }
        },
        disableHostCheck: true
    }
}
