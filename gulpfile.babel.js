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
import {
    tsLintTask,
    esLintTask
} from './tasks/lint.task';
import {
    cleanDistTask,
    cleanTmpTask,
    cleanReportsTask
} from './tasks/clean.task';
import {
    LogUtil
} from './util/util';
import {
    watchFolders
} from './tasks/watch.task';

/** Clean Tasks */
const cleanAll = gulp.series(cleanTmpTask, cleanDistTask, cleanReportsTask);
cleanAll.displayName = 'clean';
cleanAll.description = 'Performs clean up process for temporary and generated files';
gulp.task(cleanAll);
gulp.task(cleanTmpTask);
gulp.task(cleanDistTask);
gulp.task(cleanReportsTask);

/** Watch Tasks */
let watchTask = () => watchFolders.apply('src/**/*.html', ['serve']);
watchTask.displayName = 'watch:src';
watchTask.description = 'watch files for changes...';
gulp.task(watchTask);

/** Serve Tasks */
// gulp.task(serveTask);
let serveTsk = gulp.parallel(serveTask, [watchTask])
serveTsk.displayName = serveTask.displayName;
serveTsk.description = serveTask.description;
gulp.task(serveTsk);
gulp.task(serveBuildTask);

/** Compile Tasks */
gulp.task(gulpCompileEs6Task);
gulp.task(gulpCompileTsTask);

/** Lint Tasks */
const lintAll = gulp.series(esLintTask, tsLintTask);
lintAll.displayName = 'lint';
lintAll.description = 'Performs Source code analysis';
gulp.task(lintAll);
gulp.task(esLintTask);
gulp.task(tsLintTask);

/** Build Tasks */
gulp.task(buildTask);

/** Test Tasks */
gulp.task(testTask);
const e2eTestTask = gulp.series(webDriverMngrUpdateTask, e2eTask);
e2eTestTask.displayName = 'test:e2e';
e2eTestTask.description = 'Performs E2E Testing of application';
gulp.task(e2eTestTask);