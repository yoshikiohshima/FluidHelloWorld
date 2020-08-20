/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

const path = require("path");
const merge = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = env => {
    return ({
        entry: {
            app: "./test/index.ts"
        },
        resolve: {
            extensions: [".ts", ".js"],
        },
        module: {
            rules: [{
                test: /\.tsx?$/,
                loader: "ts-loader"
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            }]
        },
        output: {
            filename: "[name].bundle.js",
            path: path.resolve(__dirname, "dist"),
            library: "[name]",
            // https://github.com/webpack/webpack/issues/5767
            // https://github.com/webpack/webpack/issues/7939
            devtoolNamespace: "fluid-example/hello-world",
            libraryTarget: "umd"
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: "./test/index.html",
            }),
        ],
        mode: "development",
        devtool: "inline-source-map"
    });
};