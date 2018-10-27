import path from 'path';
import {
    IoUtil
} from '../util/util';
import {
    ContextReplacementPlugin,
    LoaderOptionsPlugin,
    SourceMapDevToolPlugin
} from 'webpack';

const cwd = process.cwd();
const appConfig = IoUtil.readJsonFile(path.join(cwd, 'app-config.json'));

export const webpackTestConfig = {
    mode: 'none',
    devtool: 'inline-source-map',
    resolve: {
        extensions: appConfig.source.allowedExtension,
        modules: [
            'node_modules',
            path.join(cwd, appConfig.source.srcDir)
        ],
    },
    module: {
        rules: [{
            test: /\.ts$/,
            enforce: 'post',
            include: path.join(cwd, appConfig.source.srcDir),
            use: {
                loader: 'istanbul-instrumenter-loader',
                options: {
                    esModules: true
                }
            },
            exclude: [/\.spec\.ts$/, /\.e2e\.ts$/, /node_modules/]
        }, {
            test: /\.ts$/,
            loaders: [{
                loader: 'awesome-typescript-loader?inlineSourceMap=true&sourceMap=false',
                options: {
                    configFileName: path.join(cwd,
                        appConfig.source.srcDir,
                        appConfig.source.appSpecTsConfig)
                }
            }, 'angular2-template-loader'],
            exclude: [/\.e2e\.ts$/, /node_modules/]
        }, {
            test: /\.json$/,
            loader: 'json-loader',
            exclude: [IoUtil.root('src/index.html')]
        }, {
            test: /\.css$/,
            loader: ['to-string-loader', 'css-loader'],
            exclude: [IoUtil.root('src/index.html')]
        }, {
            test: /\.html$/,
            loader: 'raw-loader',
            exclude: [IoUtil.root('src/index.html')]
        }, {
            test: /\.scss$/,
            exclude: /node_modules/,
            loaders: ['raw-loader', 'sass-loader']
        }]
    },
    plugins: [
        new ContextReplacementPlugin(
            /angular(\\|\/)core(\\|\/)@angular/,
            IoUtil.root(appConfig.source.srcDir), {}
        ),
        new LoaderOptionsPlugin({
            debug: true,
            options: {
                sassResources: IoUtil.root(appConfig.source.srcDir, appConfig.source.appDir)
            }
        }),
        new SourceMapDevToolPlugin({
            filename: null,
            test: /\.(ts|js)($|\?)/i
        })
    ],
    node: {
        global: true,
        process: false,
        crypto: 'empty',
        module: false,
        clearImmediate: false,
        setImmediate: false
    }
};