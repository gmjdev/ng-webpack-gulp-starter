import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import {
    IoUtil
} from '../util/util';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import webpack from 'webpack';
import LiveReloadPlugin from 'webpack-livereload-plugin';
import TSLintPlugin from 'tslint-webpack-plugin';
import {
    BundleAnalyzerPlugin
} from 'webpack-bundle-analyzer';
import CompressionPlugin from 'compression-webpack-plugin';
import {
    _
} from 'lodash';
import {
    AngularCompilerPlugin
}
from '@ngtools/webpack'
import * as moment from 'moment';

const cwd = process.cwd();
const appConfig = IoUtil.readJsonFile(path.join(cwd, 'app-config.json'));

function processBanner() {
    const data = {
        version: '1.0.0',
        buildDt: moment.utc().format('MMM DD, YYYY HH:mm'),
        package: 'pkg'
    };
    const content = appConfig.banner.content.join('\n');
    const compiled = _.template(content);
    return compiled(data);
}

export const WebPackCommonConfig = {
    entry: {
        polyfills: ['./src/polyfills.ts'],
        vendor: ['./src/vendor.ts'],
        app: ['./src/main.ts']
    },
    resolve: {
        modules: [
            "node_modules",
            path.resolve(__dirname, appConfig.source.srcDir)
        ],
        extensions: appConfig.source.allowedExtension
    },
    output: {
        path: path.join(cwd, appConfig.source.buildDir, appConfig.environment.dev),
        filename: appConfig.bundle.jsPattern || 'js/[name].[hash:8].js',
        publicPath: appConfig.server.path
    },
    optimization: {
        minimize: false,
        splitChunks: {
            name: true,
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    chunks: 'all'
                },
                default: {
                    reuseExistingChunk: true
                }
            }
        }
    },
    watchOptions: {
        aggregateTimeout: 300,
        poll: 1000,
        ignored: ['node_modules', appConfig.source.tasksDir,
            appConfig.source.e2eDir, appConfig.source.buildDir
        ]
    },
    devServer: {
        compress: true,
        port: appConfig.server.port || 9000,
        compress: true,
        clientLogLevel: 'info',
        historyApiFallback: true,
        hot: true,
        https: appConfig.server.https || false,
        proxy: appConfig.server.proxy || {}
    },
    module: {
        rules: [{
                test: /\.html$/,
                loader: 'html-loader',
                options: {
                    minimize: true,
                    removeAttributeQuotes: false,
                    collapseWhitespace: true,
                    caseSensitive: true,
                    customAttrSurround: [
                        [/#/, /(?:)/],
                        [/\*/, /(?:)/],
                        [/\[?\(?/, /(?:)/]
                    ],
                    customAttrAssign: [/\)?\]?=/]
                }
            },
            {
                test: /\.ts$/,
                loaders: [{
                    loader: 'awesome-typescript-loader',
                    options: {
                        configFileName: path.join(cwd, appConfig.source.srcDir,
                            appConfig.source.appTsConfig)
                    }
                }, 'angular2-template-loader'],
                exclude: [/\.(spec|e2e)\.ts$/]
            },
            {
                test: /\.txt$/,
                use: 'raw-loader'
            },
            {
                test: /\.s?[ac]ss$/,
                use: [
                    'to-string-loader',
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            url: false,
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true
                        }
                    }
                ],
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [{
                    loader: 'file-loader'
                }]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    'file-loader'
                ]
            },
            {
                test: /\.(csv|tsv)$/,
                use: [
                    'csv-loader'
                ]
            },
            {
                test: /\.xml$/,
                use: [
                    'xml-loader'
                ]
            },
            {
                test: /\.ejs$/,
                loader: 'ejs-loader'
            },
        ]
    },
    plugins: [
        new webpack.AutomaticPrefetchPlugin(),
        new webpack.BannerPlugin({
            banner: processBanner(),
            raw: false
        }),
        new CompressionPlugin(),
        new BundleAnalyzerPlugin({
            openAnalyzer: false,
            logLevel: 'warn'
        }),
        new webpack.ProvidePlugin({
            _: 'lodash'
        }),
        new webpack.WatchIgnorePlugin([
            path.join(cwd, 'node_modules'),
            path.join(cwd, appConfig.source.tasksDir),
            path.join(cwd, appConfig.source.buildDir)
        ]),
        new LiveReloadPlugin({
            appendScriptTag: true,
            protocol: appConfig.server.https ? "https" : "http",
            hostname: appConfig.server.host
        }),
        new webpack.ContextReplacementPlugin(
            /angular(\\|\/)core(\\|\/)@angular/,
            IoUtil.root('./src'), // location of your src
            {} // a map of your routes
        ),
        new HtmlWebpackPlugin({
            template: path.join(cwd, appConfig.source.srcDir, appConfig.indexHtml.templateFile),
            title: appConfig.indexHtml.title,
            xhtml: true,
            data: appConfig.indexHtml
        }),
        new MiniCssExtractPlugin({
            filename: appConfig.bundle.cssPattern || '[name].[contenthash:8].css'
        }),
        new TSLintPlugin({
            files: ['./src/**/*.ts']
        })
    ]
};