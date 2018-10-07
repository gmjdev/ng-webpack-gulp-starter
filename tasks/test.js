"use strict";

import path from 'path';
import {
    IoUtil,
    LogUtil
} from '../util/util';
import {
    appProgram
} from '../config/app.config.options';
import {
    Server
} from 'karma';

const cwd = process.cwd();
const appConfig = IoUtil.readJsonFile(path.join(cwd, 'app-config.json'));

export function test(done) {
    var env = appProgram.validateAndGetEnvironment(appConfig.environment);
    LogUtil.info('test', 'Testing Application for environment: ' + env);

    // path.join(cwd, appConfig.source.buildDir, env, appConfig.source.reportsDir, appConfig.junit.reportDir);

    const server = new Server({
        configFile: path.join(cwd, 'config', 'test', 'karma.conf.js'),
        singleRun: true
    }, (err) => {
        if (err === 0) {
            done();
        } else {
            LogUtil.error('test', 'Test Task exited with status code : ' + err);
            process.exit(err);
        }
    });
    server.start();
    server.on('run_complete', function (browsers, result) {
        if (result.failed > 0) {
            LogUtil.error('test', 'Failed due to failed test-cases count: ' +
                result.failed);
            process.exit(result.exitCode);
        }
        done();
    });
}