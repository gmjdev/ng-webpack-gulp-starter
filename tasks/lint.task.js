'use strict';

import {
    src,
    task
} from 'gulp';
import eslint from 'gulp-eslint';
import path from 'path';
import {
    IoUtil,
    LogUtil
} from '../util/util';

const cwd = process.cwd();
const appConfig = IoUtil.readJsonFile(path.join(cwd, 'app-config.json'));

function tsLint() {

}

function jsLint() {
    LogUtil.info('eslint', 'Perfoming linting process...');
    return src(['src/**/*.js', '!node_modules/**'])
        .pipe(eslint({
            configFile: path.join(cwd, 'config', '.eslintrc')
        }))
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