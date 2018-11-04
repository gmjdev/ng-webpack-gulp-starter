import path from 'path';
import {
    LogUtil
} from '../util/util';
import gulp from 'gulp';

const cwd = process.cwd();

function watchFolders(folderGlob, DependentTasks) {
    LogUtil.info('watch', 'Watching source file for changes...');
    return gulp.watch(folderGlob, DependentTasks);
}

export {
    watchFolders,
};