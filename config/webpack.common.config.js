import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import {
    IoUtil
} from '../util/util';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import ExtractCssChunks from 'extract-css-chunks-webpack-plugin';
import webpack from 'webpack';
import LiveReloadPlugin from 'webpack-livereload-plugin';
import TSLintPlugin from 'tslint-webpack-plugin';
import {
    AngularCompilerPlugin
} from '@ngtools/webpack';
import {
    BundleAnalyzerPlugin
} from 'webpack-bundle-analyzer';
import CompressionPlugin from 'compression-webpack-plugin';
import {
    _
} from 'lodash';
import * as moment from 'moment';
import HardSourceWebpackPlugin from 'hard-source-webpack-plugin';

const cwd = process.cwd();
const appConfig = IoUtil.readJsonFile(path.join(cwd, 'app-config.json'));
const srcDirPath = path.join(cwd, appConfig.source.srcDir);
const configDir = path.join(cwd, 'config');

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

/* eslint-disable indent */
const webpackRules = [{
        test: /\.html$/,
        loader: 'html-loader',
        options: {
            minimize: false,
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
        test: /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
        use: ['@ngtools/webpack'],
        exclude: [/\.(spec|e2e)\.ts$/]
    },
    {
        test: /\.txt$/,
        use: 'raw-loader'
    },
    // {
    //     test: /\.css$/,
    //     use: [
    //         MiniCssExtractPlugin.loader,
    //         'css-loader'
    //     ],
    // },
    {
        test: /\.(scss|css)$/,
        use: [
            'to-string-loader',
            ExtractCssChunks.loader,
            // 'style-loader',
            {
                loader: 'css-loader',
                options: {
                    url: false,
                    sourceMap: true,
                    importLoaders: 1
                }
            },
            // {
            //     loader: 'postcss-loader',
            //     options: {
            //         config: {
            //             path: configDir
            //         }
            //     }
            // },
            // 'resolve-url-loader',
            {
                loader: 'sass-loader',
                options: {
                    sourceMap: true,
                    includePaths: [
                        path.join(cwd, 'node_modules/angular-bootstrap-md/scss/bootstrap')
                    ]
                }
            }
        ]
    },
    {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
        use: ['file-loader?name=assets/[name].[hash].[ext]']
    },
    {
        test: /\.(csv|tsv)$/,
        loader: 'csv-loader'
    },
    {
        test: /\.xml$/,
        loader: 'xml-loader'
    },
    {
        test: /\.ejs$/,
        loader: 'ejs-loader'
    },
    {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
    },
];
/* eslint-enable indent */

export const WebPackCommonConfig = {
    entry: {
        polyfills: ['./src/polyfills.ts'],
        vendor: ['./src/vendor.ts'],
        app: ['./src/main.ts']
    },
    resolve: {
        modules: [
            path.join(cwd, 'node_modules'),
            srcDirPath
        ],
        extensions: appConfig.source.allowedExtension
    },
    output: {
        path: path.join(cwd, appConfig.source.buildDir, appConfig.environment.dev),
        filename: appConfig.bundle.jsPattern || 'js/[name].[hash:8].js',
        publicPath: appConfig.server.path
    },
    optimization: {
        minimize: true,
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
        clientLogLevel: 'none',
        port: appConfig.server.port || 9000,
        https: appConfig.server.https || false,
        proxy: appConfig.server.proxy || {}
    },
    module: {
        rules: webpackRules
    },
    plugins: [
        new webpack.HashedModuleIdsPlugin(),
        new AngularCompilerPlugin({
            tsConfigPath: path.join(cwd, appConfig.source.srcDir,
                appConfig.source.appTsConfig),
            mainPath: path.join(cwd, appConfig.source.srcDir,
                'main.ts'),
            entryModule: path.join(cwd, appConfig.source.srcDir, appConfig.source.appDir,
                'app.module#AppModule'),
            sourceMap: true,
            skipCodeGeneration: true
        }),
        // new HardSourceWebpackPlugin([{
        //     // HardSource works with mini-css-extract-plugin but due to how
        //     // mini-css emits assets, assets are not emitted on repeated builds with
        //     // mini-css and hard-source together. Ignoring the mini-css loader
        //     // modules, but not the other css loader modules, excludes the modules
        //     // that mini-css needs rebuilt to output assets every time.
        //     test: /mini-css-extract-plugin[\\/]dist[\\/]loader/,
        // }]),
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
        // new LiveReloadPlugin({
        //     appendScriptTag: true,
        //     protocol: appConfig.server.https ? 'https' : 'http',
        //     hostname: appConfig.server.host
        // }),
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
        // new MiniCssExtractPlugin({
        //     cache: false,
        //     filename: appConfig.bundle.cssPattern || '[name].[contenthash:8].css',
        //     chunkFilename: '[id].css'
        // }),
        new ExtractCssChunks({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: '[name].css',
            chunkFilename: '[id].css',
            hot: true, // if you want HMR - we try to automatically inject hot 
            //reloading but if it's not working, add it to the config
            orderWarning: true, // Disable to remove warnings 
            //about conflicting order between imports
            reloadAll: true, // when desperation kicks in - this is a brute force HMR flag
            cssModules: true // if you use cssModules, this can help.
        }),
        // new TSLintPlugin({
        //     files: ['./src/**/*.ts']
        // })
    ]
};