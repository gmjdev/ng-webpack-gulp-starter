'use strict';

import path from 'path';
import {
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
    webPackConfig = ProdWebPackConfig;
} else if (appProgram.validateAndGetEnvironment(appConfig.environment) ===
    appConfig.environment.dev) {
    webPackConfig = DevWebPackConfig;
}
export default webPackConfig;