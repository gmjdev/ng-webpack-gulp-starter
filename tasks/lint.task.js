import {
    src
} from 'gulp';
import eslint from 'gulp-eslint';
import tslint from 'gulp-tslint';
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
        formatter: 'stylish'
    };
    const tsLintReportOpt = {
        summarizeFailureOutput: true
    };
    return src(appConfig.lint.tsLint.files)
        .pipe(tslint(tsLintOpt))
        .pipe(tslint.report(tsLintReportOpt));
}

function esLint() {
    LogUtil.info('eslint', 'Perfoming linting process...');
    return src(appConfig.lint.esLint.files)
        .pipe(eslint({
            configFile: path.join(cwd, 'config', '.eslintrc')
        }))
        .pipe(eslint.format('html', (results) =>
            IoUtil.writeFile(
                path.join(baseDir, 'html', appConfig.lint.esLint.htmlReport),
                results)))
        .pipe(eslint.format('jslint-xml', (results) =>
            IoUtil.writeFile(
                path.join(baseDir, 'xml', appConfig.lint.esLint.xmlReport),
                results)))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
}

let tsLintTask = tsLint;
tsLintTask.displayName = 'lint:ts';
tsLintTask.description = 'lint:ts description';

let esLintTask = esLint;
esLintTask.displayName = 'lint:es';
esLintTask.description = 'lint:es description';

export {
    tsLintTask,
    esLintTask
};