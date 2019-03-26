const path = require('path');

module.exports = {
    entry: "./script/minesweeper.js",
    output: {
        filename: "app.js",
        path: path.resolve(__dirname + "/build")
    },

    mode: 'production',

    resolve: {
        extensions: ['.js']
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            }
        ]
    }
};