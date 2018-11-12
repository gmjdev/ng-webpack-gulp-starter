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
const destinationPath = path.join(cwd, appConfig.source.buildDir, appConfig.environment.dev);

let pathsToClean = [appConfig.environment.dev];

let cleanOptions = {
    root: path.resolve(cwd, appConfig.source.buildDir),
    verbose: true,
    dry: false
};


let devConfiguration = {
    mode: 'development',
    devtool: 'cheap-module-eval-source-map',
    output: {
        path: destinationPath
    },
    watchOptions: {
        ignored: [
            'node_modules',
            appConfig.source.tasksDir,
            appConfig.source.e2eDir,
            appConfig.source.buildDir
        ]
    },
    devServer: {
        contentBase: [
            destinationPath
        ],
        publicPath: appConfig.server.path,
        open: true,
        openPage: '/',
        historyApiFallback: true,
        hot: appConfig.server.hmr,
        compress: true,
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': JSON.stringify({
                'NODE_ENV': appConfig.environment.dev
            })
        }),
        new CleanWebpackPlugin(pathsToClean, cleanOptions),
        new webpack.NoEmitOnErrorsPlugin()
    ],
};

if (appConfig.server.hmr) {
    devConfiguration.entry = {};
    devConfiguration.entry.hmrClient = [
        'webpack/hot/only-dev-server',
        'webpack-hot-middleware/client?reload=true'
    ];
    devConfiguration.plugins.push(new webpack.HotModuleReplacementPlugin());
}

export const config = merge(WebPackCommonConfig, devConfiguration);