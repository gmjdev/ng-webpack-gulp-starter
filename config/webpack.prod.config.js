import CleanWebpackPlugin from 'clean-webpack-plugin';
import merge from 'webpack-merge';
import {
    WebPackCommonConfig
} from './webpack.common.config';
import path from 'path';
import {
    IoUtil
} from '../util/util';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import {
    DefinePlugin,
    SourceMapDevToolPlugin,
    HashedModuleIdsPlugin
} from 'webpack';
import {
    AngularCompilerPlugin
} from '@ngtools/webpack';
import {
    CleanCssWebpackPlugin
} from '@angular-devkit/build-angular/src/angular-cli-files/plugins/cleancss-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';

const cwd = process.cwd();
const appConfig = IoUtil.readJsonFile(path.join(cwd, 'app-config.json'));
const destinationPath = path.resolve(cwd, appConfig.source.buildDir,
    appConfig.environments.prod);
const uglifyJsOptions = {
    parallel: true,
    sourceMap: true,
    cache: true,
    extractComments: true,
    terserOptions: {
        warnings: false,
        compress: {
            inline: 1
        },
        mangle: true,
        output: null,
        toplevel: false,
        nameCache: null,
        ie8: false,
        'keep_fnames': false
    }
};

let pathsToClean = [appConfig.environments.prod];

let cleanOptions = {
    root: path.resolve(cwd, appConfig.source.buildDir),
    verbose: true,
    dry: false
};

export const config = merge(WebPackCommonConfig, {
    mode: 'production',
    output: {
        path: destinationPath
    },
    optimization: {
        noEmitOnErrors: true,
        runtimeChunk: 'single',
        namedModules: true, // NamedModulesPlugin()
        concatenateModules: true, //ModuleConcatenationPlugin
        minimize: true,
        splitChunks: { // CommonsChunkPlugin()
            name: true,
            chunks: 'all',
            automaticNameDelimiter: '-',
            cacheGroups: {
                default: {
                    minChunks: 2,
                    priority: 10,
                    reuseExistingChunk: true
                },
                styles: {
                    name: 'styles',
                    chunks: 'all',
                    enforce: true,
                    test: /([\\|/]node_modules[\\|/]?)([\\|/](\w[\w ]*.*))+[\\|/]?(.css)/
                },
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                },
            }
        },
        minimizer: [
            new HashedModuleIdsPlugin(),
            new TerserPlugin(uglifyJsOptions),
            new CleanCssWebpackPlugin({
                sourceMap: true,
                test: (file) => /\.(?:css)$/.test(file),
            }),
            new OptimizeCSSAssetsPlugin({})
        ]
    },
    plugins: [
        new AngularCompilerPlugin({
            tsConfigPath: path.join(cwd, appConfig.source.srcDir,
                appConfig.source.appTsConfig),
            mainPath: path.join(cwd, appConfig.source.srcDir,
                'main.ts'),
            entryModule: path.join(cwd, appConfig.source.srcDir, appConfig.source.appDir,
                'app.module#AppModule'),
            sourceMap: true,
            nameLazyFiles: false,
            skipCodeGeneration: false,
            hostReplacementPaths: {
                [path.join(cwd, 'environments', 'environment.ts')]: path.join(cwd, 'environments',
                    'environment.prod.ts')
            }
        }),
        new DefinePlugin({
            'process.env': JSON.stringify({
                'NODE_ENV': appConfig.environments.prod
            })
        }),
        new SourceMapDevToolPlugin({
            filename: 'sourcemaps/[file].map',
            exclude: ['vendor.js']
        }),
        new CleanWebpackPlugin(pathsToClean, cleanOptions),
        new MiniCssExtractPlugin({
            cache: true,
            filename: appConfig.bundle.cssPattern || 'css/[name].[contenthash:8].css',
            chunkFilename: '[id].css'
        })
    ],
});