const path = require('path');

module.exports = {
    mode: 'development',
    context: path.resolve(__dirname, 'src'),
    entry: {
        app: './app.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/dist',
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: `${__dirname}/src`,
                query: {
                    presets: ['env', 'stage-2']
                }
            },
            {
                enforce: 'pre',
                test: /\.js$/,
                loader: 'eslint-loader',
                include: `${__dirname}/src`,
                exclude: /node_modules/,
                options: {
                    emitWarning: true
                }
            }
        ]
    },
    stats: {
        colors: true
    },
    devtool: 'source-map',
    devServer: {
        contentBase: path.resolve(__dirname, 'src')
    }
};
