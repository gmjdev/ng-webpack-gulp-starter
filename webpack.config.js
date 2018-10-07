'use strict';

import path from 'path';
import {
    LogUtil,
    IoUtil
} from './util/util';
import {
    DevWebPackConfig
} from './config/webpack.dev.config';
import {
    ProdWebPackConfig
} from './config/webpack.prod.config';
import {
    appProgram
} from './config/app.config.options';

const cwd = process.cwd();
const appConfig = IoUtil.readJsonFile(path.join(cwd, 'app-config.json'));

let webPackConfig = {};
if (appProgram.validateAndGetEnvironment(appConfig.environment) ===
    appConfig.environment.prod) {
    LogUtil.info('App', 'Processing build for release / production environment');
    webPackConfig = ProdWebPackConfig;
} else if (appProgram.validateAndGetEnvironment(appConfig.environment) ===
    appConfig.environment.dev) {
    LogUtil.info('App', 'Processing build for development environment');
    webPackConfig = DevWebPackConfig;
}
export default webPackConfig;