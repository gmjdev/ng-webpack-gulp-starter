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
import webpack from 'webpack';

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
        path: path.resolve(cwd, appConfig.source.buildDir, appConfig.environment.prod)
    },
    optimization: {
        minimize: true,
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
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': appConfig.environment.prod
            }
        }),
        new CleanWebpackPlugin(pathsToClean, cleanOptions),
        new MiniCssExtractPlugin({
            cache: false,
            filename: appConfig.bundle.cssPattern || '[name].[contenthash:8].css',
            chunkFilename: '[id].css'
        }),
    ],
});