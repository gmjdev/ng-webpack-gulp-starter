'use strict';

import {
    series,
    parallel,
    registry
}
from 'gulp';
import serve from './tasks/serve';
import HubRegistry from 'gulp-hub';

const hub = new HubRegistry(['tasks/*.js']);
registry(hub);

exports.default = serve;