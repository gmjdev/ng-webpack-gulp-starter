import path from 'path';
import {
    LogUtil
} from '../util/util';
import {
    Server
} from 'karma';

const cwd = process.cwd();

function test(done) {
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

let testTask = test;
testTask.displayName = 'test:junit';
testTask.description = 'test:junit description';

export {
    testTask,
};