import gulp from 'gulp';
import babel from 'gulp-babel';

import {
    LogUtil
} from '../util/util';

function gulpCompileEs6(files, dist) {
    LogUtil.info('compile:es6', 'Compiling Javascript...');
    return gulp.src(files)
        .pipe(babel())
        .pipe(gulp.dest(dist));
}

let gulpCompileEs6Task = gulpCompileEs6;
gulpCompileEs6Task.displayName = 'compile:es6';
gulpCompileEs6Task.description = 'Compile ES6+ Javascript modules for browsers';

export {
    gulpCompileEs6Task,
    gulpCompileEs6
};