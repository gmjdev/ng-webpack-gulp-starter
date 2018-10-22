import {
    IoUtil
} from '../util/util';
import program from 'commander';

export class AppProgram {
    static initializeAppOptions() {
        program
            .version('0.0.1')
            .option('-e, --env [env]', 'Specify environment option', 'development')
        return program;
    }

    static validateAndGetEnvironment(environments) {
        const localPrgm = AppProgram.initializeAppOptions();
        localPrgm.parse(process.argv);
        const env = localPrgm.env ? localPrgm.env : process.env.NODE_ENV;
        const env2 = IoUtil.validateEnvironment(environments, env);
        return env2;
    }
}