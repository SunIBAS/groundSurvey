module.exports = {
    filenameHashing: true,
    devServer: {
        host: '0.0.0.0',
        port: 8081,
        // https: true,
        open: true,
        proxy: {
            // detail: https://cli.vuejs.org/config/#devserver-proxy
            '/': {
                target: `http://172.20.109.155:8080/`,
                changeOrigin: true,
                pathRewrite: {
                    ['^/']: ''
                }
            }
        },
        disableHostCheck: true
    }
}
