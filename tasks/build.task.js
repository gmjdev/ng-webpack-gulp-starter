import path from 'path';
import webpack from 'webpack';
import {
    IoUtil,
    LogUtil
} from '../util/util';
import {
    AppProgram
} from '../config/app.config.options';

const cwd = process.cwd();
const appConfig = IoUtil.readJsonFile(path.join(cwd, 'app-config.json'));

function build(done) {
    var env = AppProgram.validateAndGetEnvironment(appConfig.environment);
    const webPkEnv = appConfig.environment.prod === env ? 'prod' : 'dev';
    var config = require('../config/webpack.' + webPkEnv + '.config').config;
    LogUtil.info('build', 'Building Application for environment: ' + env);
    webpack(config, (err, stats) => {
        if (err) {
            LogUtil.error('build', 'Unable to process build :(');
            LogUtil.error('build', 'Error: ' + JSON.stringify(stats));
        } else {
            LogUtil.success('build', 'Building Application completed successfully :)');
            LogUtil.info(stats.toString());
        }
        done();
    });
}

let buildTask = build;
buildTask.displayName = 'build';
buildTask.description = 'Build the application for distribution and deployment purpose';

export {
    buildTask
};