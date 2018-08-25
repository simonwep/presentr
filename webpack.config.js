const UglifyJs = require('uglifyjs-webpack-plugin');

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
        contentBase: __dirname + '/demo',
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
        new UglifyJs({
            uglifyOptions: {
                output: {
                    comments: false
                },
                mangle: {
                    properties: {
                        regex: /^_/
                    }
                }
            }
        })
    ]
};