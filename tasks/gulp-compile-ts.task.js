import path from 'path';
import gulp from 'gulp';
import ts from 'gulp-typescript';

import {
    IoUtil,
    LogUtil
} from '../util/util';

const cwd = process.cwd();
const appConfig = IoUtil.readJsonFile(path.join(cwd, 'app-config.json'));

function gulpCompileTs(tsConfig, files, done) {
    if (!IoUtil.fileExists(tsConfig)) {
        LogUtil.error('compile:ts',
            'Provided typescript configuration file does not exists "' +
            tsConfig + '"');
        throw new Error('Missing typescript configuration :(');
    }

    LogUtil.info('compile:ts', 'Starting typescript compilation using file: "' +
        tsConfig + '"');
    const tsProject = ts.createProject(tsConfig);
    const callback = tsProject.src().pipe(tsProject()).js.pipe();

    LogUtil.error('Callback type: ' + typeof callback);
    LogUtil.error('Callback type: ' + typeof callback.prototype);
    LogUtil.error('Callback type: ' + callback.prototype);
    const configFileLoc = path.join(cwd, 'config', 'test', appConfig.test.e2e.configFile);
    const e2eTsConfigFileLoc = path.join(cwd, 'config', 'test', appConfig.test.e2e.tsConfigFile);

    if (!IoUtil.fileExists(configFileLoc)) {
        LogUtil.error('compile:ts', 'Protractor configuration file does not exists on path: "' +
            configFileLoc + '"');
        throw new Error('Missing Protractor configuration :(');
    }

    if (!IoUtil.fileExists(e2eTsConfigFileLoc)) {
        LogUtil.error('compile:ts',
            'Protractor typescript configuration file does not exists on path: "' +
            e2eTsConfigFileLoc + '"');
        throw new Error('Missing Protractor Typescript configuration :(');
    }

    LogUtil.info('e2e', 'Using Protractor typescript configuration file: "' +
        e2eTsConfigFileLoc + '"');
    LogUtil.info('e2e', 'Starting End to End application testing....' + configFileLoc);
    return gulp.src(appConfig.test.e2e.specFile)
        .pipe(protractor({
            configFile: configFileLoc
        }))
        .on('end', () => {
            LogUtil.info('e2e', 'Completed End to End application testing successfully :) !!!');
            // socketIoUtil.emitEvent(url, 'asyncComplete');
            done();
        })
        .on('error', function (e) {
            LogUtil.error('e2e', 'Completed End to End application with error :(');
            LogUtil.error('e2e', 'Error: ' + e.toString());
            //socketIoUtil.emitEvent(url, 'asyncComplete');
            done();
        });
}

let gulpCompileTsTask = gulpCompileTs;
gulpCompileTs.displayName = 'compile:ts';
gulpCompileTs.description = 'compile typescript files to Javascript files ' +
    'to be used in browsers';

export {
    gulpCompileTsTask
};