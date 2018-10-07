'use strict';

import {
    series,
    parallel
} from 'gulp';
import {
    serve,
    serveBuild
} from './tasks/serve';
import {
    build
} from './tasks/build';
import {
    test
} from './tasks/test';


const buildAndServe = series(build, serveBuild);

export {
    serve,
    test,
    build,
    buildAndServe
}

export default serve;