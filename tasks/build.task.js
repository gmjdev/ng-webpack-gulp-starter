import path from 'path';
import webpack from 'webpack';
import {
    IoUtil,
    LogUtil,
    Util
} from '../util/util';
import {
    AppProgram
} from '../config/app.config.options';

const cwd = process.cwd();
const appConfig = IoUtil.readJsonFile(path.join(cwd, 'app-config.json'));

function build(done) {
    var env = AppProgram.validateAndGetEnvironment(appConfig.environment);
    const isProdEnv = appConfig.environment.prod === env;
    const webPkEnv = isProdEnv ? 'prod' : 'dev';
    var config = require(`../config/webpack.${webPkEnv}.config`).config;
    LogUtil.info('build', `Building Application for environment: ${env}`);

    if (appConfig.server.hmr && !isProdEnv) {
        Object.keys(config.entry).forEach(e => {
            if (Util.isArray(config.entry[e]) &&
                (e === 'main' || e === 'app')) {
                let noHmr = [];
                LogUtil.info('build', `Removing HMR entry for entry point: ${e}`);
                config.entry[e].forEach(item => {
                    if (item !== 'webpack-hot-middleware/client?reload=true') {
                        noHmr.push(item);
                    }
                });
                LogUtil.info('build',
                    'Removed HMR entry for entry point successfully');
                config.entry[e] = noHmr;
            }
        });
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
                LogUtil.info(stats.toString('errors-only'));
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