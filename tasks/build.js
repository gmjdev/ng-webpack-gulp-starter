"use strict";

import path from 'path';
import webpack from 'webpack';
import {
    IoUtil,
    LogUtil
} from '../util/util';
import {
    appProgram
} from '../config/app.config.options';

const cwd = process.cwd();
const appConfig = IoUtil.readJsonFile(path.join(cwd, 'app-config.json'));

export function build(done) {
    var env = appProgram.validateAndGetEnvironment(appConfig.environment);
    const webPkEnv = appConfig.environment.prod === env ? 'prod' : 'dev';
    var config = require('../config/webpack.' + webPkEnv + '.config').config;
    LogUtil.info('build', 'Building Application for environment: ' + env);
    webpack(config, (err, stats) => {
        if (err) {
            LogUtil.error('build', 'Unable to process build :(');
            LogUtil.error('build', 'Error: ' + JSON.stringify(stats));
        } else {
            LogUtil.success('build', 'Building Application completed successfully :)');
            LogUtil.info(stats.toString());
        }
        done();
    });
}