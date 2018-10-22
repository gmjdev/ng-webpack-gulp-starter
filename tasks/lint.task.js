'use strict';

import {
    src
} from 'gulp';
import eslint from 'gulp-eslint';
import tslint from "gulp-tslint";
import path from 'path';
import {
    IoUtil,
    LogUtil
} from '../util/util';

const cwd = process.cwd();
const appConfig = IoUtil.readJsonFile(path.join(cwd, 'app-config.json'));
const baseDir = path.join(cwd, appConfig.source.buildDir, appConfig.source.reportsDir,
    appConfig.lint.report.reportDir);

function tsLint() {
    const tsLintOpt = {
        formatter: "stylish"
    };
    const tsLintReportOpt = {
        summarizeFailureOutput: true
    };
    return src(['src/**/*.ts', '!node_modules/**'])
        .pipe(tslint(tsLintOpt))
        .pipe(tslint.report(tsLintReportOpt));
}

function jsLint() {
    LogUtil.info('eslint', 'Perfoming linting process...');
    return src(['src/**/*.js', '!node_modules/**'])
        .pipe(eslint({
            configFile: path.join(cwd, 'config', '.eslintrc')
        }))
        .pipe(eslint.format('html', (results) =>
            IoUtil.writeFile(
                path.join(baseDir, 'html', 'eslint-report.html'),
                results)))
        .pipe(eslint.format('jslint-xml', (results) =>
            IoUtil.writeFile(
                path.join(baseDir, 'xml', 'eslint-report.xml'),
                results)))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
}

let tsLintTask = tsLint;
tsLintTask.displayName = 'lint:ts';
tsLintTask.description = 'lint:ts description';

let jsLintTask = jsLint;
jsLintTask.displayName = 'lint:js';
jsLintTask.description = 'lint:js description';

export {
    tsLintTask,
    jsLintTask
};