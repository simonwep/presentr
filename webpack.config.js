const {version} = require('./package');
const webpack = require('webpack');

module.exports = {

    entry: './src/presentr.js',

    output: {
        path: __dirname + '/dist',
        publicPath: '/dist/',
        filename: 'presentr.min.js',
        library: 'Presentr',
        libraryTarget: 'umd'
    },

    devServer: {
        contentBase: __dirname + '/',
        host: '0.0.0.0',
        port: 3008
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader'
            }
        ]
    },

    plugins: [
        new webpack.BannerPlugin({
            banner: `Presentr ${version} MIT | https://github.com/Simonwep/presentr`
        })
    ]
};
