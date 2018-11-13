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
    webpack,
    HashedModuleIdsPlugin
} from 'webpack';
import {
    AngularCompilerPlugin
} from '@ngtools/webpack';
import UglifyJSPlugin from 'uglifyjs-webpack-plugin';
import {
    CleanCssWebpackPlugin
} from '@angular-devkit/build-angular/src/angular-cli-files/plugins/cleancss-webpack-plugin';
import {
    SuppressExtractedTextChunksWebpackPlugin
} from '@angular-devkit/build-angular/src/angular-cli-files/plugins/suppress-entry-chunks-webpack-plugin';


const cwd = process.cwd();
const appConfig = IoUtil.readJsonFile(path.join(cwd, 'app-config.json'));

let pathsToClean = [appConfig.environment.prod];

let cleanOptions = {
    root: path.resolve(cwd, appConfig.source.buildDir),
    verbose: true,
    dry: false
};

export const config = merge(WebPackCommonConfig, {
    mode: 'production',
    output: {
        path: path.resolve(cwd, appConfig.source.buildDir,
            appConfig.environment.prod)
    },
    optimization: {
        noEmitOnErrors: true,
        runtimeChunk: 'single',
        splitChunks: {
            cacheGroups: {
                default: {
                    chunks: 'async',
                    minChunks: 2,
                    priority: 10
                },
                common: {
                    name: 'common',
                    chunks: 'async',
                    minChunks: 2,
                    enforce: true,
                    priority: 5
                },
                vendors: false,
                vendor: false
            }
        },
        minimizer: [
            new HashedModuleIdsPlugin(),
            new UglifyJSPlugin({
                sourceMap: true,
                cache: true,
                parallel: true,
                uglifyOptions: {
                    safari10: true,
                    output: {
                        'ascii_only': true,
                        comments: false,
                        webkit: true,
                    },
                    compress: {
                        'pure_getters': true,
                        passes: 3,
                        inline: 3,
                    }
                }
            }),
            new CleanCssWebpackPlugin({
                sourceMap: true,
                test: (file) => /\.(?:css)$/.test(file),
            })
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
        new SuppressExtractedTextChunksWebpackPlugin(),
        new webpack.DefinePlugin({
            'process.env': JSON.stringify({
                'NODE_ENV': appConfig.environment.prod
            })
        }),
        new CleanWebpackPlugin(pathsToClean, cleanOptions),
        new MiniCssExtractPlugin({
            cache: false,
            filename: appConfig.bundle.cssPattern || '[name].[contenthash:8].css',
            chunkFilename: '[id].css'
        })
    ],
});