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
                    {loader: 'raw-loader'}
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
    devtool: "inline-source-map",
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html'
        })
    ]
};