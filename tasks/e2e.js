"use strict";

import path from 'path';
import gulp from 'gulp';
import {
    IoUtil,
    LogUtil
} from '../util/util';
import webPackConfig from '../webpack.config';
import {
    appProgram
} from '../config/app.config.options';
import {
    protractor
} from 'gulp-protractor'
import {
    config
} from 'rxjs';

const cwd = process.cwd();
const appConfig = IoUtil.readJsonFile(path.join(cwd, 'app-config.json'));

export default function e2e(done) {
    LogUtil.info('e2e', 'Starting End to End application testing....');
    const configFileLoc = path.join(cwd, 'config', 'test', appConfig.test.e2e.configFile);

    if (!IoUtil.fileExists(configFileLoc)) {
        LogUtil.error('e2e', 'Protractor configuration file does not exists on path: "' +
            configFileLoc + '"');
        throw new Error('Missing Protractor configuration :(');
    }

    LogUtil.info('e2e', 'Starting End to End application testing....' + configFileLoc);
    return gulp.src(appConfig.test.e2e.specFile)
        .pipe(protractor({
            configFile: configFileLoc
        }))
        .on('end', function (e) {
            LogUtil.info('e2e', 'Completed End to End application testing successfully :) !!!');
            // socketIoUtil.emitEvent(url, 'asyncComplete');
            done();
        })
        .on('error', function (e) {
            LogUtil.error('e2e', 'Completed End to End application with error :(');
            //socketIoUtil.emitEvent(url, 'asyncComplete');
            done();
        });
}