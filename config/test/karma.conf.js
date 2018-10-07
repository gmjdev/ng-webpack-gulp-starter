import path from 'path';
import {
    appProgram
} from '../app.config.options';
import {
    IoUtil
} from '../../util/util';
import {
    webpackTestConfig
} from '../webpack.test';
const cwd = process.cwd();
const appConfig = IoUtil.readJsonFile(path.join(cwd, 'app-config.json'));
const env = appProgram.validateAndGetEnvironment(appConfig.environment);
const baseDir = path.join(cwd, appConfig.source.buildDir, appConfig.source.reportsDir,
    appConfig.test.junit.reportDir);

export default function (config) {
    config.set({
        basePath: '',

        files: appConfig.test.junit.files,

        frameworks: appConfig.test.junit.frameworks,

        reporters: ["progress", "kjhtml", "coverage", 'remap-coverage'],

        preprocessors: {
            '../../src/test.ts': ["webpack", "sourcemap", "coverage"]
        },

        files: appConfig.test.junit.files,

        failOnEmptyTestSuite: false,

        webpack: webpackTestConfig,

        webpackMiddleware: {
            //'errors-only' - print error onlys
            stats: 'normal'
        },
        webpackServer: {
            noInfo: true
        },
        client: {
            clearContext: false
        },
        coverageReporter: {
            type: 'in-memory',
            dir: path.join(cwd, appConfig.source.buildDir, appConfig.source.reportsDir,
                appConfig.test.junit.reportDir),
            /*reporters: [{
                type: 'text-summary'
            }, {
                type: 'html',
                subdir: 'html'
            }, {
                type: 'cobertura',
                subdir: '.',
                file: 'cobertura-coverage.xml'
            }, {
                type: 'lcovonly',
                subdir: '.',
                file: 'lcovonly-coverage.txt'
            }],
            fixWebpackSourcePaths: true,
            /*check: {
                global: {
                    statements: 50,
                    branches: 50,
                    functions: 50,
                    lines: 50,
                    excludes: []
                },
                each: {
                    statements: 50,
                    branches: 50,
                    functions: 50,
                    lines: 50,
                    excludes: [],
                    overrides: {}
                }
            },*/
        },
        remapCoverageReporter: {
            html: path.join(baseDir, 'html'),
            cobertura: path.join(baseDir, 'cobertura.xml')
        },
        mime: {
            'text/x-typescript': appConfig.test.junit.tsMime
        },

        port: appConfig.test.junit.port,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: appConfig.test.junit.browsers,
        singleRun: appConfig.test.junit.singleRun
    });
};