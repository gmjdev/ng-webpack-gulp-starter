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
    cleanReportsTask,
    cleanCacheTask
} from './tasks/clean.task';
import {
    LogUtil
} from './util/util';

/** Clean Tasks */
const cleanAll = gulp.series(cleanTmpTask, cleanCacheTask, cleanDistTask, cleanReportsTask);
cleanAll.displayName = 'clean';
cleanAll.description = 'Performs clean up process for temporary and generated files';
gulp.task(cleanAll);
gulp.task(cleanTmpTask);
gulp.task(cleanCacheTask);
gulp.task(cleanDistTask);
gulp.task(cleanReportsTask);

/** Serve Tasks */
let serveTskWithClean = gulp.series(cleanAll, serveTask);
serveTskWithClean.displayName = serveTask.displayName;
serveTskWithClean.description = serveTask.description;
gulp.task(serveTask);
gulp.task(serveTskWithClean);
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