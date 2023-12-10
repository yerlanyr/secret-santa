const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
module.exports = {
    output: {
        path: path.resolve(__dirname, 'server/public')
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    {loader: 'style-loader'},
                    {loader: 'css-loader'}
                ]
            },
            {
                test: /\.html/,
                use: [
                    {loader: 'raw-loader'}
                ]
            }
        ]
    },
    devtool: process.env.NODE_ENV == "development" ? "inline-source-map" : 'nosources-source-map',
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html'
        })
    ]
};