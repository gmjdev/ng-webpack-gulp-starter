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
    const env = AppProgram.validateAndGetEnvironment(appConfig.environments);
    const webPkEnv = appConfig.environments.prod === env ? 'prod' : 'dev';
    LogUtil.info('serve', `Serving Application for environment: ${env}`);
    const webPackConfig = require(`../config/webpack.${webPkEnv}.config`).config;
    const directory = appConfig.source.buildDir;
    const servePath = path.join(cwd, directory, env);
    LogUtil.info('serve', `Serving build from: ${servePath}`);
    if (!IoUtil.isDirectoryEmpty(servePath)) {
        app.use(express.static(servePath));
        app.listen(appConfig.server.port || 9000, () => {
            const url = buildUrl();
            LogUtil.info('serve', `Open your browser if it is not already opened @ ${url}`);
            opn(url);
        });
    } else {
        throw new Error('Build is not available for serving :(');
    }
}

function serve() {
    LogUtil.info('serve', 'Running Webpack build Server...');
    const env = AppProgram.validateAndGetEnvironment(appConfig.environments);
    const webPkEnv = appConfig.environments.prod === env ? 'prod' : 'dev';
    const webPackConfig = require(`../config/webpack.${webPkEnv}.config`).config;
    const compiler = webpack(webPackConfig);
    const app = express();
    const enableHot = webPackConfig.devServer && webPackConfig.devServer.hot;
    app.use(middleware(compiler, {
        noInfo: true,
        publicPath: webPackConfig.output.publicPath,
        logLevel: 'debug',
        overlay: {
            warnings: false,
            errors: true
        }
    }));

    if (appConfig.server.hmr && enableHot) {
        LogUtil.info('serve', 'Using HMR with webpack');
        app.use(hotMiddleware(compiler, {
            log: console.log,
            path: '/__webpack_hmr',
            heartbeat: 10 * 1000
        }));
    }

    app.listen(appConfig.server.port || 9000, () => {
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