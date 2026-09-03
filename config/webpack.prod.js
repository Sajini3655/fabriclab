const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const ROOT_DIRECTORY = process.cwd();

module.exports = {
    mode: "production",
    entry: {
        main: path.resolve(ROOT_DIRECTORY, "src/index.ts"),
    },
    output: {
        filename: "bundle.[contenthash:8].js",
        path: path.resolve(ROOT_DIRECTORY, "dist"),
        clean: true,
    },
    resolve: {
        extensions: [".ts", ".js"],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {
                            url: true,
                            import: true,
                            modules: false,
                        },
                    },
                ],
            },
            {
                test: /\.wgsl$/,
                type: "asset/source",
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: "asset/resource",
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: "main.[contenthash:8].css",
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(ROOT_DIRECTORY, "src/index.html"),
            filename: "index.html",
            inject: "body",
            meta: {
                webgpu: {
                    "http-equiv": "origin-trial",
                    content: "webgpu",
                },
            },
        }),
    ],
};
