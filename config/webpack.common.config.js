import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import {
    IoUtil
} from '../util/util';
import webpack from 'webpack';
import LiveReloadPlugin from 'webpack-livereload-plugin';
import {
    AngularCompilerPlugin
} from '@ngtools/webpack';
import {
    BundleAnalyzerPlugin
} from 'webpack-bundle-analyzer';
import {
    _
} from 'lodash';
import * as moment from 'moment';
// import HardSourceWebpackPlugin from 'hard-source-webpack-plugin';
import CircularDependencyPlugin from 'circular-dependency-plugin';
import ProgressPlugin from 'webpack/lib/ProgressPlugin';


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
        test: /\.ts$/,
        use: ['@ngtools/webpack'],
        exclude: [/\.(spec|e2e)\.ts$/]
    },
    {
        test: /\.js$/,
        exclude: /(ngfactory|ngstyle).js$/,
        enforce: 'pre',
        use: 'source-map-loader'
    },
    {
        test: /\.txt$/,
        use: 'raw-loader'
    },
    {
        test: /\.css$/,
        use: ['to-string-loader', 'css-loader'],
        include: [path.join(srcDirPath, appConfig.source.appDir)]
    },
    {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
        exclude: [path.join(srcDirPath, appConfig.source.appDir)]
    },
    {
        test: /\.scss$/,
        use: [
            'to-string-loader',
            {
                loader: 'css-loader',
                options: {
                    url: false,
                    sourceMap: true,
                    importLoaders: 1
                }
            },
            {
                loader: 'sass-loader',
                options: {
                    sourceMap: true,
                    includePaths: [
                        path.join(cwd, 'node_modules/angular-bootstrap-md/scss/bootstrap')
                    ]
                }
            }
        ],
        include: [srcDirPath]
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
    {
        test: /[/\\]@angular[/\\]core[/\\].+\.js$/,
        parser: {
            system: true
        },
    }
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
        publicPath: appConfig.server.path,
        pathinfo: false
    },
    optimization: {
        minimize: false,
        splitChunks: {
            name: true,
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    chunks: 'initial'
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
        ignored: [
            'node_modules',
            appConfig.source.tasksDir,
            appConfig.source.e2eDir,
            appConfig.source.buildDir
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
        new webpack.AutomaticPrefetchPlugin(),
        new webpack.HashedModuleIdsPlugin(),
        new AngularCompilerPlugin({
            tsConfigPath: path.join(cwd, appConfig.source.srcDir,
                appConfig.source.appTsConfig),
            mainPath: path.join(cwd, appConfig.source.srcDir,
                'main.ts'),
            entryModule: path.join(cwd, appConfig.source.srcDir, appConfig.source.appDir,
                'app.module#AppModule'),
            sourceMap: true,
            nameLazyFiles: true,
            skipCodeGeneration: true
        }),
        new ProgressPlugin(),
        new CircularDependencyPlugin({
            exclude: /[\\/]node_modules[\\/]/
        }),
        new webpack.BannerPlugin({
            banner: processBanner(),
            raw: false
        }),
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
            protocol: appConfig.server.https ? 'https' : 'http',
            hostname: appConfig.server.host
        }),
        new webpack.ContextReplacementPlugin(
            /angular(\\|\/)core(\\|\/)@angular/,
            /\/@angular(\\|\/)core(\\|\/)fesm5/,
            srcDirPath, // location of your src
            {} // a map of your routes
        ),
        new HtmlWebpackPlugin({
            template: path.join(cwd, appConfig.source.srcDir, appConfig.indexHtml.templateFile),
            title: appConfig.indexHtml.title,
            xhtml: true,
            data: appConfig.indexHtml
        })
    ]
};