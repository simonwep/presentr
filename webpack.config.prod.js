const {version} = require('./package');
const webpack = require('webpack');

module.exports = {
    entry: './src/presentr.js',

    output: {
        path:`${__dirname}/dist`,
        filename: 'presentr.min.js',
        library: 'Presentr',
        libraryExport: 'default',
        libraryTarget: 'umd'
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                loader: [
                    'babel-loader',
                    'eslint-loader'
                ]
            }
        ]
    },

    plugins: [
        new webpack.BannerPlugin({
            banner: `Presentr ${version} MIT | https://github.com/Simonwep/presentr`
        }),

        new webpack.DefinePlugin({
            VERSION: JSON.stringify(version)
        })
    ]
};
