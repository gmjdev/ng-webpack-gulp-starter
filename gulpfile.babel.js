'use strict';

import gulp from 'gulp';
import {
    e2eTask,
    webDriverMngrUpdateTask
} from './tasks/e2e.task';
import {
    buildTask
} from './tasks/build.task';
import {
    gulpCompileEs6Task
} from './tasks/gulp-compile-es6.task';
import {
    gulpCompileTsTask
} from './tasks/gulp-compile-ts.task';
import {
    serveTask,
    serveBuildTask
} from './tasks/serve.task';
import {
    testTask
} from './tasks/test.task';

gulp.task(serveTask);
gulp.task(serveBuildTask);
gulp.task(gulpCompileEs6Task);
gulp.task(gulpCompileTsTask);
gulp.task(buildTask);
gulp.task(testTask);
gulp.task(e2eTask);
gulp.task('webdriver:update', webDriverMngrUpdateTask);