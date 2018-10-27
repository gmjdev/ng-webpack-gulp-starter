import path from 'path';
import {
    IoUtil,
    LogUtil
} from '../util/util';
import {
    AppProgram
} from '../config/app.config.options';
import del from 'del';

const cwd = process.cwd();
const appConfig = IoUtil.readJsonFile(path.join(cwd, 'app-config.json'));

function cleanTmp() {
    LogUtil.info('clean', 'Performing clean up task for temporary directory ...');
    const dir = path.join(cwd, appConfig.source.tempDir) + '/**';
    const exclude = '!' + dir.replace('/**', '');
    return del([dir, exclude]);
}

function cleanDist() {
    const env = AppProgram.validateAndGetEnvironment(appConfig.environment);
    const buildDir = appConfig.environment.prod === env ? appConfig.environment.prod :
        appConfig.environment.dev;
    LogUtil.info('clean', 'Performing clean up task for build directory for environment: ' + buildDir);
    const dir = path.join(cwd, appConfig.source.buildDir, buildDir) + '/**';
    const exclude = '!' + dir.replace('/**', '');
    return del([dir, exclude]);
}

function cleanReports() {
    LogUtil.info('clean', 'Performing clean up task for report directory ...');
    const dir = path.join(cwd, appConfig.source.buildDir, appConfig.source.reportsDir) + '/**';
    const exclude = '!' + dir.replace('/**', '');
    return del([dir, exclude]);
}

let cleanTmpTask = cleanTmp;
cleanTmpTask.displayName = 'clean:tmp';
cleanTmpTask.description = 'Performs clean up process for temporary files';

let cleanDistTask = cleanDist;
cleanDistTask.displayName = 'clean:dist';
cleanDistTask.description = 'Performs clean up process for build files';

let cleanReportsTask = cleanReports;
cleanReportsTask.displayName = 'clean:reports';
cleanReportsTask.description = 'Performs clean up process for reports files';

export {
    cleanTmpTask,
    cleanDistTask,
    cleanReportsTask
};