const CopyPlugin = require('copy-webpack-plugin');
const HTMLPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require('path');
const { DefinePlugin } = require('webpack')

const { sentryWebpackPlugin } = require("@sentry/webpack-plugin");

require('dotenv').config();

const sentryConfig = {
    url: process.env.SENTRY_VITE_URL,
    authToken: process.env.SENTRY_VITE_AUTH_TOKEN,
    org: process.env.SENTRY_VITE_ORG,
    project: process.env.SENTRY_VITE_PROJECT,

    setCommits: {
        auto: true,
    },
};

module.exports = {
    devtool: "source-map",
    entry: {
        options: './src/options.js',
        popup: './src/popup.js',
        content: './src/content.js',
        background: './src/background.js',
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        clean: true
    },
    plugins: [
        sentryWebpackPlugin(sentryConfig),
        new DefinePlugin({
            'process.env.SENTRY_DSN': JSON.stringify(process.env.SENTRY_DSN)
        }),
        new MiniCssExtractPlugin(),
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'src/static/manifest.json'),
                    to: path.resolve(__dirname, 'dist/manifest.json')
                },
                {
                    from: path.resolve(__dirname, 'src/static/favicon.png'),
                    to: path.resolve(__dirname, 'dist/assets/favicon.png')
                },
                { from: path.resolve(__dirname, 'src/static/fonts'), to: path.resolve(__dirname, 'dist/assets/fonts') },
                {
                    from: path.resolve(__dirname, 'src/static/favorite_placeholder.jpg'),
                    to: path.resolve(__dirname, 'dist/assets/favorite_placeholder.jpg')
                },
                {
                    from: path.resolve(__dirname, 'src/static/cart_placeholder.jpg'),
                    to: path.resolve(__dirname, 'dist/assets/cart_placeholder.jpg')
                },
                {
                    from: path.resolve(__dirname, 'src/static/cursor.png'),
                    to: path.resolve(__dirname, 'dist/assets/cursor.png')
                },
                {
                    from: path.resolve(__dirname, 'src/static/pin.png'),
                    to: path.resolve(__dirname, 'dist/assets/pin.png')
                },
                {
                    from: path.resolve(__dirname, 'src/static/form-success.png'),
                    to: path.resolve(__dirname, 'dist/assets/form-success.png')
                },
            ],
        }),
        new HTMLPlugin({
            chunks: ['options'],
            filename: 'options.html',
            title: 'Vite App',
        }),
        new HTMLPlugin({
            chunks: ['popup'],
            filename: 'popup.html',
        }),
    ],
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules)/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"],
                        plugins: [
                            ["@babel/plugin-transform-react-jsx", {
                                runtime: "automatic",
                                importSource: "preact"
                            }],
                            ["@babel/plugin-transform-runtime"]
                        ],
                    },
                },
            },
            {
                test: /\.(sass|css)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                localIdentName: '[hash:base64:8]',
                            }
                        },
                    },
                    'postcss-loader',
                ]
            },
            {
                test: /\.(woff(2)?|ttf|eot)$/,
                type: 'asset/resource',
                generator: {
                    filename: './assets/fonts/[name][ext]',
                    publicPath: 'chrome-extension://__MSG_@@extension_id__/'
                },
            },
        ],
    },
    resolve: {
        extensions: [".js", ".jsx"],
        modules: [path.resolve(__dirname, 'src'), 'node_modules'],
        alias: {
            react: 'preact/compat',
            'react-dom': 'preact/compat',
        },
    },
    mode: 'production',
    stats: 'minimal',
};
