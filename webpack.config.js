var path = require('path');
//var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');

module.exports = {
    entry: ['babel-polyfill', './app/main.js'],
    output: {
        path: __dirname + "/dist",
        filename: 'bundle.js',
    },
    //plugins: [new HtmlWebpackPlugin()],
    module: {
        rules: [
            {
                loader: 'babel-loader',
                test: /\.js$/,
                exclude: /node_modules/
            }
        ]
    },
    devServer: {
        host: "0.0.0.0",
        port: 3000,
        writeToDisk: true
    }
};