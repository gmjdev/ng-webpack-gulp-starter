"use strict";

import gulp from 'gulp';
import babel from 'gulp-babel';

import {
    LogUtil
} from '../util/util';

export function gulpCompileEs6(files, dist) {
    LogUtil.info('compile:es6', 'Compiling Javascript...')
    return gulp.src(files)
        .pipe(babel())
        .pipe(gulp.dest(dist));
}