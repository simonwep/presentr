const webpack = require('webpack');

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
        port: 3003
    },

    plugins: [
        new webpack.DefinePlugin({
            VERSION: JSON.stringify('unknown')
        })
    ],

    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader'
            }
        ]
    }
};
