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
        const localPrgm = this.initializeAppOptions();
        localPrgm.parse(process.argv);
        console.log('----------->' + localPrgm.env);
        const env = localPrgm.env ? localPrgm.env : process.env.NODE_ENV;
        console.log('----------->env' + env);
        const env2 = IoUtil.validateEnvironment(environments, env);
        console.log('----------->env' + env2);
        return env2;
    }
}