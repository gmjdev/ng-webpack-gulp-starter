// // 'use strict';

// import path from 'path';
// import {
//     IoUtil
// } from './util/util';
// import {
//     DevWebPackConfig
// } from './config/webpack.dev.config';
// import {
//     ProdWebPackConfig
// } from './config/webpack.prod.config';
// import {
//     AppProgram
// } from './config/app.config.options';

// const cwd = process.cwd();
// const appConfig = IoUtil.readJsonFile(path.join(cwd, 'app-config.json'));
// const env = AppProgram.validateAndGetEnvironment(appConfig.environment);
// export const webPackConfig = appConfig.environment.prod === 'prod' ?
//     ProdWebPackConfig : DevWebPackConfig;