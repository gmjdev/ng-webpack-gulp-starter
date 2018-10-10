'use strict';

import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
const _root = path.resolve(__dirname, '..');

class LogUtil {
    static error(msg) {
        console.log(chalk.redBright(msg));
    }

    static error(task, msg) {
        console.log(chalk.redBright(`[${task}]: `) + msg);
    }

    static success(msg) {
        console.log(chalk.green(msg));
    }

    static success(task, msg) {
        console.log(chalk.green(`[${task}]: `) + msg);
    }

    static warning(msg) {
        console.log(chalk.red(msg));
    }

    static warning(task, msg) {
        console.log(chalk.red(`[${task}]: `) + msg);
    }

    static info(msg) {
        console.log(chalk.yellowBright(msg));
    }

    static info(task, msg) {
        console.log(chalk.yellowBright(`[${task}]: `) + msg);
    }
}

class IoUtil {
    static readFile(filePath, charset) {
        if (!fs.existsSync(filePath)) {
            throw new Error("File does not exists: " + filePath);
        }
        return fs.readFileSync(filePath, charset || 'utf8');
    }

    static readJsonFile(filePath) {
        var rawdata = IoUtil.readFile(filePath);
        return JSON.parse(rawdata);
    }

    static root(args) {
        args = Array.prototype.slice.call(arguments, 0);
        return path.join.apply(path, [_root].concat(args));
    }

    static parseArguments(argument) {
        let arg = {},
            a, opt, thisOpt, curOpt;
        for (a = 0; a < argument.length; a++) {
            thisOpt = argument[a].trim();
            opt = thisOpt.replace(/^\-+/, '');

            if (opt === thisOpt) {
                if (curOpt) arg[curOpt] = opt;
                curOpt = null;
            } else {
                curOpt = opt;
                arg[curOpt] = true;
            }
        }
        return arg;
    }

    static validateEnvironment(availableEnvironment, env) {
        var validEnv = [];
        var exists = Object.keys(availableEnvironment).some(function (key) {
            validEnv.push(availableEnvironment[key].toLowerCase());
            return availableEnvironment[key].toLowerCase() === env.toLowerCase();
        });

        if (!exists) {
            throw new Error(chalk.red('Unsupported environment is specified, ' +
                'please specify valid environments from: ') + chalk.green(JSON.stringify(validEnv)));
        }
    }

    static fileExists(filePath) {
        return fs.existsSync(filePath);
    }
}

export {
    IoUtil,
    LogUtil
};