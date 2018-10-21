'use strict';

import gulp from 'gulp';
import {
    e2e,
    webDriverMngrUpdate
} from './tasks/e2e';
import {
    build
} from './tasks/build';
import {
    gulpCompileEs6
} from './tasks/gulp-compile-es6';
import {
    gulpCompileTs
} from './tasks/gulp-compile-ts';
import {
    serve,
    serveBuild
} from './tasks/serve';
import {
    test
} from './tasks/test';

gulp.task('serve', serve);
gulp.task('serve:build', serveBuild);
gulp.task('compile:ts', gulpCompileTs);
gulp.task('compile:es6', gulpCompileEs6);
gulp.task('build', build);
gulp.task('test:e2e', e2e);
gulp.task('test:update', webDriverMngrUpdate);
gulp.task('test:junit', test);