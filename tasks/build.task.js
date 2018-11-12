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

    if (config.entry && config.entry.hmrClient) {
        LogUtil.info('build', 'Removing HMR client entry from webpack ' +
            'configuration ');
        delete config.entry['hmrClient'];
    }

    if (config.watchOptions) {
        LogUtil.info('build', 'Removing watch options from webpack ' +
            'configuration ');
        delete config['watchOptions'];
    }

    if (config.devServer) {
        LogUtil.info('build', 'Removing server config from webpack ' +
            'configuration ');
        delete config['devServer'];
    }

    return new Promise(resolve =>
        webpack(config, (err, stats) => {
            if (err) {
                LogUtil.error('build', 'Unable to process build :(');
                LogUtil.error('build', 'Error: ' + JSON.stringify(stats));
            } else {
                LogUtil.success('build', 'Building Application completed successfully :)');
                LogUtil.info(stats.toString("errors-only"));
            }
            done();
            resolve();
        }));
}

let buildTask = build;
buildTask.displayName = 'build';
buildTask.description = 'Build the application for distribution and deployment purpose';

export {
    buildTask
};