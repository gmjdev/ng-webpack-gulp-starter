import path from 'path';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import merge from 'webpack-merge';
import {
    WebPackCommonConfig
} from './webpack.common.config';
import webpack from 'webpack';
import {
    IoUtil,
    Util,
    LogUtil
} from '../util/util';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import {
    AngularCompilerPlugin
} from '@ngtools/webpack';

const cwd = process.cwd();
const appConfig = IoUtil.readJsonFile(path.join(cwd, 'app-config.json'));
const destinationPath = path.join(cwd, appConfig.source.buildDir,
    appConfig.environment.dev);
const pathsToClean = [appConfig.environment.dev];
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
        historyApiFallback: true,
        hot: appConfig.server.hmr,
        compress: true,
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
            nameLazyFiles: true,
            skipCodeGeneration: true
        }),
        new webpack.DefinePlugin({
            'process.env': JSON.stringify({
                'NODE_ENV': appConfig.environment.dev
            })
        }),
        new CleanWebpackPlugin(pathsToClean, cleanOptions),
        new MiniCssExtractPlugin({
            filename: '[name].css',
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
    devConfiguration.plugins.push(new webpack.HotModuleReplacementPlugin());
}

export const config = merge(WebPackCommonConfig, devConfiguration);