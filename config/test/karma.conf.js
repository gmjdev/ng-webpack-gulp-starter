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

        // Webpack Config at ./webpack.test.js
        webpack: webpackTestConfig,

        // Webpack please don't spam the console when running in karma!
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
            dir: path.join(cwd, appConfig.source.buildDir, env, appConfig.source.reportsDir,
                appConfig.junit.reportDir),
            reporters: [{
                type: 'text-summary'
            }, {
                type: 'html',
                subdir: 'html'
            }],
            fixWebpackSourcePaths: true,
            check: {
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
            },
        },
        remapCoverageReporter: {
            html: './coverage/html',
            cobertura: './coverage/cobertura.xml'
        },

        /*karmaTypescriptConfig: {
            tsconfig: '../../src/tsconfig.spec.json',
            compilerOptions: {
                module: "commonjs"
            },
            bundlerOptions: {
                resolve: {
                    directories: [appConfig.source.srcDir, "node_modules"]
                }
            }
        },*/
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