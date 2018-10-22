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
    AppProgram
} from './config/app.config.options';

export function isProdEnvironment() {
    const env = AppProgram.validateAndGetEnvironment(appConfig.environment);
    return appConfig.environment.prod === env;
}

const cwd = process.cwd();
const appConfig = IoUtil.readJsonFile(path.join(cwd, 'app-config.json'));
export const webPackConfig = isProdEnvironment() ?
    ProdWebPackConfig : DevWebPackConfig;