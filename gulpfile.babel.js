'use strict';

import {
    series,
    parallel
} from 'gulp';
import {
    serve,
    serveBuild
} from './tasks/serve';
import build from './tasks/build';
import test from './tasks/test';
import e2e from './tasks/e2e';


const buildAndServe = series(build, serveBuild);

export {
    e2e,
    serve,
    test,
    build,
    buildAndServe
}

export default serve;