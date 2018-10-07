"use strict";

import path from 'path';
import webpack from 'webpack';
import middleware from 'webpack-dev-middleware';
import hotMiddleware from 'webpack-hot-middleware';
import express from 'express';
import {
    IoUtil,
    LogUtil
} from '../util/util';
import webPackConfig from '../webpack.config';
import opn from 'opn';

const cwd = process.cwd();
const appConfig = IoUtil.readJsonFile(path.join(cwd, 'app-config.json'));

function buildUrl() {
    const proto = appConfig.server.https ? 'https' : 'http';
    const port = appConfig.server.port;
    const host = appConfig.server.host;
    const url = `${proto}://${host}:${port}/`;
    return url;
}

export function serveBuild() {
    const app = express();
    const env = appProgram.validateAndGetEnvironment(appConfig.environment);
    LogUtil.info('[serve]: Serving Application for environment: ' + env);
    const directory = appConfig.source.buildDir;
    const servePath = path.join(cwd, directory, env);
    LogUtil.info(`[serve]: Serving build from: ${servePath}`);
    app.use(express.static(servePath));
    app.listen(webPackConfig.devServer.port, () => {
        const url = buildUrl();
        LogUtil.info(`[serve]: Open your browser if it is not already opened @ ${url}`);
        opn(url);
    });
}

export function serve() {
    LogUtil.info('[serve]: Running Webpack build Server...');
    const compiler = webpack(webPackConfig);
    const app = express();
    app.use(middleware(compiler, {
        noInfo: true,
        hot: webPackConfig.devServer.hot,
        publicPath: webPackConfig.output.publicPath,
        stats: {
            colors: true
        },
        logLevel: 'error',
        overlay: {
            warnings: true,
            errors: true
        },
    }));
    app.use(hotMiddleware(compiler));
    app.listen(webPackConfig.devServer.port, () => {
        const url = buildUrl();
        LogUtil.info(`[serve]: Open your browser if it is not already opened @ ${url}`);
        opn(url);
    });
}