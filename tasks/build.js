"use strict";

import path from 'path';
import webpack from 'webpack';
import {
    IoUtil,
    LogUtil
} from '../util/util';
import webPackConfig from '../webpack.config';
import {
    appProgram
} from '../config/app.config.options';

const cwd = process.cwd();
const appConfig = IoUtil.readJsonFile(path.join(cwd, 'app-config.json'));

export default function build(done) {
    var env = appProgram.validateAndGetEnvironment(appConfig.environment);
    LogUtil.info('build', 'Building Application for environment: ' + env);
    webpack(webPackConfig, (err, stats) => {
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