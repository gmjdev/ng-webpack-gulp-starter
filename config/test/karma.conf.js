import path from 'path';
import {
    IoUtil
} from '../../util/util';
import {
    webpackTestConfig
} from '../webpack.test';
const cwd = process.cwd();
const appConfig = IoUtil.readJsonFile(path.join(cwd, 'app-config.json'));
const baseDir = path.join(appConfig.source.buildDir, appConfig.source.reportsDir,
    appConfig.test.report.coverageDir);
const junitDir = path.join(cwd, appConfig.source.buildDir, appConfig.source.reportsDir,
    appConfig.test.report.junitDir);

export default function (config) {
    config.set({
        basePath: '',

        files: appConfig.test.junit.files,

        frameworks: appConfig.test.junit.frameworks,

        reporters: appConfig.test.junit.reporters,

        preprocessors: {
            '../../src/test.ts': appConfig.test.junit.preprocessors
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

        htmlReporter: {
            outputFile: path.join(junitDir, appConfig.test.report.junitReportFileName),
            pageTitle: 'Unit Tests Result',
            subPageTitle: '',
            groupSuites: true,
            useCompactStyle: true,
            useLegacyStyle: true
        },

        coverageReporter: {
            type: 'in-memory',
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
            cobertura: path.join(baseDir, appConfig.test.report.coberturaFileName),
            lcovonly: path.join(baseDir, appConfig.test.report.lcovonlyFileName),
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