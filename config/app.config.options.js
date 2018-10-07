import {
    IoUtil
} from '../util/util';
import program from 'commander';

class AppProgram {
    initializeAppOptions() {
        program
            .version('0.0.1')
            .option('-e, --env [env]', 'Specify environment option', 'development')
        return program;
    }

    validateAndGetEnvironment(environments) {
        const localPrgm = this.initializeAppOptions();
        localPrgm.parse(process.argv);
        var env = localPrgm.env ? localPrgm.env : process.env.NODE_ENV;
        IoUtil.validateEnvironment(environments, env);
        return env;
    }
}

const appProgram = new AppProgram();

export {
    appProgram
}