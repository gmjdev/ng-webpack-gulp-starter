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

export default function test(done) {
    LogUtil.info('test', 'Running Unit testing for application...');
    const server = new Server({
        configFile: path.join(cwd, 'config', 'test', 'karma.conf.js'),
        singleRun: true
    }, (err) => {
        if (err === 0) {
            LogUtil.info('test', 'Unit testing completed successfully');
            done();
        } else {
            LogUtil.error('test', 'Unit testing resulted into error with status code: ' + err);
            process.exit(err);
        }
    });
    server.start();
    server.on('run_complete', function (browsers, result) {
        if (result.failed > 0) {
            LogUtil.error('test', 'Unit testing with test failures, No of Failed Test count' +
                result.failed);
            process.exit(result.exitCode);
        }
        done();
    });
}