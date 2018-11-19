import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import {
    IoUtil
} from '../util/util';
import {
    ProvidePlugin,
    AutomaticPrefetchPlugin,
    HashedModuleIdsPlugin,
    BannerPlugin,
    WatchIgnorePlugin,
    ContextReplacementPlugin
} from 'webpack';
import {
    BundleAnalyzerPlugin
} from 'webpack-bundle-analyzer';
import {
    _
} from 'lodash';
import * as moment from 'moment';
import CircularDependencyPlugin from 'circular-dependency-plugin';
import autoprefixer from 'autoprefixer';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import rxPaths from 'rxjs/_esm5/path-mapping';
import {
    SuppressExtractedTextChunksWebpackPlugin
} from '@angular-devkit/build-angular/src/angular-cli-files/plugins/suppress-entry-chunks-webpack-plugin';
import ExtractCssChunks from 'extract-css-chunks-webpack-plugin';

const cwd = process.cwd();
const appConfig = IoUtil.readJsonFile(path.join(cwd, 'app-config.json'));
const srcDirPath = path.join(cwd, appConfig.source.srcDir);
const includePaths = [
    path.join(cwd, 'node_modules/angular-bootstrap-md/scss/bootstrap')
];
const vendorEntries = ['./src/vendor.ts'];
const appEntries = ['./src/main.ts'];

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

const sassLoader = {
    loader: 'fast-sass-loader',
    options: {
        sourceMap: true,
        'includePaths': includePaths
    }
};
const postCssLoader = {
    loader: 'postcss-loader',
    options: {
        sourceMap: true,
        plugins: () => [
            autoprefixer()
        ]
    }
};
const cssLoader = {
    loader: 'css-loader',
    options: {
        sourceMap: true,
        url: false,
        module: false,
        localIdentName: '[name]__[local].[hash:base64:5]',
        importLoaders: 1
    }
};

/* eslint-disable indent */
const webpackRules = [{
        test: /\.(sc|sa|c)ss$/,
        use: [postCssLoader, sassLoader],
        include: [path.join(srcDirPath, appConfig.source.appDir)]
    },
    {
        test: /\.(sc|sa|c)ss$/,
        use: ['style-loader', {
            loader: 'css-loader',
            options: {
                sourceMap: true,
                url: false,
                module: false,
                localIdentName: '[name]__[local].[hash:base64:5]',
                importLoaders: 2
            }
        }, postCssLoader, {
            loader: 'sass-loader',
            options: {
                sourceMap: true,
                'includePaths': includePaths,
                indentedSyntax: false
            }
        }],
        exclude: [path.join(srcDirPath, appConfig.source.appDir)]
    },
    {
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
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
        use: ['file-loader?name=assets/[name].[hash].[ext]']
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
    },
    {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [{
            loader: 'file-loader',
            options: {
                name: '[name].[ext]',
                outputPath: 'fonts/'
            }
        }]
    }
];
/* eslint-enable indent */

let assets = [{
    from: path.join(cwd, appConfig.source.srcDir, appConfig.source.assetsDir),
    to: appConfig.source.assetsDir
}];

//copy fonts configured in config files
if (appConfig.assets.fonts && appConfig.assets.fonts.length > 0) {
    appConfig.assets.fonts.forEach((item) => {
        assets.push({
            from: item,
            to: path.join(appConfig.source.assetsDir,
                appConfig.source.fontDir)
        });
    });
}

//copy images configured in config files
if (appConfig.assets.images && appConfig.assets.images.length > 0) {
    appConfig.assets.images.forEach((item) => {
        assets.push({
            from: item,
            to: path.join(appConfig.source.assetsDir,
                appConfig.source.imagesDir)
        });
    });
}

//copy global styles sheets and scripts
if (appConfig.global.scripts && appConfig.global.scripts.length > 0) {
    appConfig.global.scripts.forEach((item) => vendorEntries.push(item));
}

if (appConfig.global.styles && appConfig.global.styles.length > 0) {}

export const WebPackCommonConfig = {
    cache: false,
    node: false,
    performance: {
        hints: false,
    },
    entry: {
        polyfills: ['./src/polyfills.ts'],
        vendor: vendorEntries,
        app: appEntries
    },
    resolve: {
        modules: [
            path.join(cwd, 'node_modules'),
            srcDirPath
        ],
        extensions: appConfig.source.allowedExtension,
        alias: rxPaths()
    },
    output: {
        path: path.join(cwd, appConfig.source.buildDir, appConfig.environments.dev),
        filename: appConfig.bundle.jsPattern || 'js/[name].[hash:8].js',
        publicPath: appConfig.server.path,
        pathinfo: false
    },
    optimization: {
        namedModules: true, // NamedModulesPlugin()
        noEmitOnErrors: true, // NoEmitOnErrorsPlugin
        concatenateModules: true, //ModuleConcatenationPlugin
        minimize: true,
        splitChunks: { // CommonsChunkPlugin()
            cacheGroups: {
                // vendor: {
                //     test: /[\\/]node_modules[\\/]/,
                //     name: 'vendor',
                //     chunks: 'all'
                // },
                styles: {
                    test: /([\\|/]node_modules[\\|/]?)([\\|/](\w[\w ]*.*))+[\\|/]?(.s?[ac]ss)/,
                    chunks: 'all',
                    name: 'vendor-styles'
                },
                default: {
                    reuseExistingChunk: true
                }
            }
        }
    },
    module: {
        rules: webpackRules
    },
    plugins: [
        new CopyWebpackPlugin(assets),
        new AutomaticPrefetchPlugin(),
        new HashedModuleIdsPlugin(),
        new SuppressExtractedTextChunksWebpackPlugin(),
        new CircularDependencyPlugin({
            exclude: /[\\/]node_modules[\\/]/
        }),
        new BannerPlugin({
            banner: processBanner(),
            raw: false,
            exclude: /vendor/
        }),
        new BundleAnalyzerPlugin({
            openAnalyzer: false,
            logLevel: 'warn'
        }),
        new ProvidePlugin({
            _: 'lodash'
        }),
        new WatchIgnorePlugin([
            path.join(cwd, 'node_modules'),
            path.join(cwd, appConfig.source.tasksDir),
            path.join(cwd, appConfig.source.buildDir)
        ]),
        new ContextReplacementPlugin(
            /angular(\\|\/)core(\\|\/)@angular/,
            /\/@angular(\\|\/)core(\\|\/)fesm5/,
            srcDirPath, // location of your src
            {} // a map of your routes
        ),
        new HtmlWebpackPlugin({
            template: path.join(cwd, appConfig.source.srcDir,
                appConfig.indexHtml.templateFile),
            title: appConfig.indexHtml.title,
            xhtml: true,
            data: appConfig.indexHtml
        }),
        new ExtractCssChunks({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: 'css/[name].css',
            chunkFilename: 'css/[id].css',
            hot: true, // if you want HMR - we try to automatically inject hot reloading but if it's not working, add it to the config
            orderWarning: true, // Disable to remove warnings about conflicting order between imports
            reloadAll: true, // when desperation kicks in - this is a brute force HMR flag
            cssModules: false // if you use cssModules, this can help.
        }),
    ]
};