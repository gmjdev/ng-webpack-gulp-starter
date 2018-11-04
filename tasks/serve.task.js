import path from 'path';
import webpack from 'webpack';
import middleware from 'webpack-dev-middleware';
import hotMiddleware from 'webpack-hot-middleware';
import express from 'express';
import {
    IoUtil,
    LogUtil,
} from '../util/util';
import opn from 'opn';
import {
    AppProgram
} from '../config/app.config.options';

const cwd = process.cwd();
const appConfig = IoUtil.readJsonFile(path.join(cwd, 'app-config.json'));

function buildUrl() {
    const proto = appConfig.server.https ? 'https' : 'http';
    const port = appConfig.server.port;
    const host = appConfig.server.host;
    const url = `${proto}://${host}:${port}/`;
    return url;
}

function serveBuild() {
    const app = express();
    const env = AppProgram.validateAndGetEnvironment(appConfig.environment);
    LogUtil.info('serve', `Serving Application for environment: ${env}`);
    const webPackConfig = require('../config/webpack.' + env + '.config').config;
    const directory = appConfig.source.buildDir;
    const servePath = path.join(cwd, directory, env);
    LogUtil.info('serve', `Serving build from: ${servePath}`);
    app.use(express.static(servePath));
    app.listen(webPackConfig.devServer.port, () => {
        const url = buildUrl();
        LogUtil.info('serve', `Open your browser if it is not already opened @ ${url}`);
        opn(url);
    });
}

function serve() {
    LogUtil.info('serv', 'Running Webpack build Server...');
    const env = AppProgram.validateAndGetEnvironment(appConfig.environment);
    const webPackConfig = require('../config/webpack.' + env + '.config').config;
    const compiler = webpack(webPackConfig);
    const app = express();
    app.use(middleware(compiler, {
        noInfo: true,
        hot: webPackConfig.devServer.hot,
        publicPath: webPackConfig.output.publicPath,
        stats: {
            colors: true
        },
        logLevel: 'warn',
        overlay: {
            warnings: false,
            errors: true
        },
    }));
    app.use(hotMiddleware(compiler));
    app.listen(webPackConfig.devServer.port, () => {
        const url = buildUrl();
        LogUtil.info('serve', `Open your browser if it is not already opened @ ${url}`);
        opn(url);
    });
}

let serveTask = serve;
serveTask.displayName = 'serve';
serveTask.description = 'Build and serve content via Web browser with live reload feature';

let serveBuildTask = serveBuild;
serveBuildTask.displayName = 'serve:build';
serveBuildTask.description = 'Serve already generated application based on current environment variable';

export {
    serveTask,
    serveBuildTask
};