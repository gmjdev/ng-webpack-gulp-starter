"use strict";

import path from 'path';
import {
    IoUtil,
    LogUtil
} from '../util/util';
import SocketIoUtil from '../util/socketIo.util';
import {
    protractor
} from 'gulp-protractor'
import gulpCompileEs6 from './gulp-compile-es6.task';

const cwd = process.cwd();
const appConfig = IoUtil.readJsonFile(path.join(cwd, 'app-config.json'));

const webDriverMngrUpdate = protractor.webdriver_update;

function e2e(done) {
    LogUtil.info('e2e', 'Starting End to End application testing....');
    const configFileLoc = path.join(cwd, 'config', 'test', appConfig.test.e2e.configFile);
    const e2eTsConfigFileLoc = path.join(cwd, 'config', 'test', appConfig.test.e2e.tsConfigFile);
    const tmpLoc = path.join(cwd, appConfig.source.tempDir);

    if (!IoUtil.fileExists(configFileLoc)) {
        LogUtil.error('e2e', 'Protractor configuration file does not exists on path: "' +
            configFileLoc + '"');
        throw new Error('Missing Protractor configuration :(');
    }

    if (!IoUtil.fileExists(e2eTsConfigFileLoc)) {
        LogUtil.error('e2e', 'Protractor typescript configuration file does not exists on path: "' +
            e2eTsConfigFileLoc + '"');
        throw new Error('Missing Protractor Typescript configuration :(');
    }

    const filesToCompile = [path.join(cwd, "**/*.js"), '!node_modules/**/*',
        '!dist/**/*'
    ];
    const callback = gulpCompileEs6(filesToCompile, tmpLoc);
    // const callback2 = gulpCompileTs(e2eTsConfigFileLoc);
    console.log('--->' + JSON.stringify(protractor));

    LogUtil.info('e2e', 'Using Protractor typescript configuration file: "' +
        e2eTsConfigFileLoc + '"');
    return gulp.src(appConfig.test.e2e.specFile)
        .pipe(protractor({
            configFile: path.join(tmpLoc, 'config', 'test', appConfig.test.e2e.configFile)
        }))
        .on('end', function (e) {
            LogUtil.info('e2e', 'Completed End to End application testing successfully :) !!!');
            // SocketIoUtil.emitEvent(url, 'asyncComplete');
            done();
        })
        .on('error', function (e) {
            LogUtil.error('e2e', 'Completed End to End application with error :(');
            LogUtil.error('e2e', 'Error' + JSON.stringify(e));
            const url = 'url';
            // SocketIoUtil.emitEvent(url, 'asyncComplete');
            done();
        });
};

let e2eTask = e2e;
e2eTask.displayName = 'test:e2e';
e2eTask.description = 'test:e2e description';

let webDriverMngrUpdateTask = webDriverMngrUpdate;

export {
    e2eTask,
    webDriverMngrUpdateTask
};