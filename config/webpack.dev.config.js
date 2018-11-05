import path from 'path';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import merge from 'webpack-merge';
import {
    WebPackCommonConfig
} from './webpack.common.config';
import webpack from 'webpack';
import {
    IoUtil
} from '../util/util';

const cwd = process.cwd();
const appConfig = IoUtil.readJsonFile(path.join(cwd, 'app-config.json'));

let pathsToClean = [appConfig.environment.dev];

let cleanOptions = {
    root: path.resolve(cwd, appConfig.source.buildDir),
    verbose: true,
    dry: false
};

export const config = merge(WebPackCommonConfig, {
    mode: 'development',
    devtool: 'cheap-module-eval-source-map',
    entry: {
        client: [
            'webpack-hot-middleware/client?reload=true'
        ]
    },
    output: {
        path: path.join(cwd, appConfig.source.buildDir, appConfig.environment.dev)
    },
    devServer: {
        contentBase: [
            path.join(cwd, appConfig.source.buildDir, appConfig.environment.dev)
        ],
        publicPath: appConfig.server.path,
        open: true,
        openPage: '/',
        historyApiFallback: true,
        hot: true,
        compress: true,
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': appConfig.environment.dev
            }
        }),
        new CleanWebpackPlugin(pathsToClean, cleanOptions),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    ],
});