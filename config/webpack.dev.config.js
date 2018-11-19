import path from 'path';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import merge from 'webpack-merge';
import {
    WebPackCommonConfig
} from './webpack.common.config';
import {
    DefinePlugin,
    HotModuleReplacementPlugin
} from 'webpack';
import {
    IoUtil,
    Util,
    LogUtil
} from '../util/util';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import {
    AngularCompilerPlugin
} from '@ngtools/webpack';
import HardSourceWebpackPlugin from 'hard-source-webpack-plugin';

const cwd = process.cwd();
const appConfig = IoUtil.readJsonFile(path.join(cwd, 'app-config.json'));
const destinationPath = path.join(cwd, appConfig.source.buildDir,
    appConfig.environments.dev);
const pathsToClean = [appConfig.environments.dev];
const cleanOptions = {
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
    devServer: {
        contentBase: [
            destinationPath
        ],
        publicPath: appConfig.server.path,
        open: true,
        openPage: '/',
        historyApiFallback: appConfig.server.historyApiFallback,
        hot: appConfig.server.hmr,
        compress: true,
        clientLogLevel: 'none',
        port: appConfig.server.port || 9000,
        https: appConfig.server.https || false,
        proxy: appConfig.server.proxy || {}
    },
    plugins: [
        new HardSourceWebpackPlugin({
            cacheDirectory: path.join(cwd, 'cache'),
            environmentHash: {
                root: process.cwd(),
                directories: [],
                files: ['package-lock.json'],
            },
        }),
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
        new DefinePlugin({
            'process.env': JSON.stringify({
                'NODE_ENV': appConfig.environments.dev
            })
        }),
        new CleanWebpackPlugin(pathsToClean, cleanOptions),
        new MiniCssExtractPlugin({
            filename: 'css/[name].css',
            chunkFilename: '[id].css'
        })
    ],
};

if (appConfig.server.hmr) {
    Object.keys(WebPackCommonConfig.entry).forEach(e => {
        if (Util.isArray(WebPackCommonConfig.entry[e]) &&
            (e === 'main' || e === 'app')) {
            LogUtil.info('Adding HMR entry for entry point: ' + e);
            WebPackCommonConfig.entry[e].push(
                'webpack-hot-middleware/client?reload=true');
        }
    });
    devConfiguration.plugins.push(new HotModuleReplacementPlugin({
        multiStep: true
    }));
}

export const config = merge(WebPackCommonConfig, devConfiguration);