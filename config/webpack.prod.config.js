"use strict";

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

let pathsToClean = [appConfig.source.buildDir, appConfig.environment.prod];

let cleanOptions = {
    root: path.resolve(cwd, appConfig.source.buildDir),
    verbose: true,
    dry: false
};

export const ProdWebPackConfig = merge(WebPackCommonConfig, {
    mode: 'production',
    output: {
        path: path.resolve(cwd, appConfig.source.buildDir, appConfig.environment.prod)
    },
    optimization: {
        minimize: true
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': appConfig.environment.prod
            }
        }),
        new CleanWebpackPlugin(pathsToClean, cleanOptions)
    ],
});