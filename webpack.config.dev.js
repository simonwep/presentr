module.exports = {
    entry: './src/presentr.js',

    output: {
        path: `${__dirname}/dist`,
        publicPath: '/dist/',
        filename: 'presentr.min.js',
        library: 'Presentr',
        libraryExport: 'default',
        libraryTarget: 'umd'
    },

    devServer: {
        host: '0.0.0.0',
        port: 3008
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader'
            }
        ]
    }
};
