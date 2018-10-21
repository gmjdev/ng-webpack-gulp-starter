'use strict';

import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import {
    spawn,
    spawnSync
} from 'child_process';
import * as _ from 'lodash';
import {
    glob
} from 'glob';

const cwd = process.cwd();
const webDriverMngr = {
    seleniumDriver: 'Selenium standalone version available',
    chromeDriver: 'chromedriver version available'
};
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
        let rawdata = IoUtil.readFile(filePath);
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
        let validEnv = [];
        let exists = Object.keys(availableEnvironment).some(function (key) {
            validEnv.push(availableEnvironment[key].toLowerCase());
            if (availableEnvironment[key].toLowerCase() === env.toLowerCase()) {
                console.log('Key--->' + key + "  " + availableEnvironment[key]);
                return key;
            }
        });

        if (!exists) {
            throw new Error(chalk.red('Unsupported environment is specified, ' +
                'please specify valid environments from: ') + chalk.green(JSON.stringify(validEnv)));
        }
    }

    static fileExists(filePath) {
        return fs.existsSync(filePath);
    }

    static getRelativePathToDir(fullPath, from) {
        var filePath = '';
        if (!from) {
            filePath = fullPath;
        }

        if (!fullPath) {
            throw new Error('Path should not be empty or null.');
        }

        var index = fullPath.indexOf(from);
        filePath = fullPath;
        if (index >= 0) {
            filePath = fullPath.substr(index + from.length);
        }
        if (filePath.indexOf('/') === 0) {
            filePath = filePath.substr(1);
        }
        return filePath;
    }

    static resolvePathFromCwd(targetPath) {
        return path.resolve(cwd, targetPath);
    }

    static hasProcessFlag(flag) {
        return process.argv.join('').indexOf(flag) > -1;
    }

    static mkDirIfNotExists(path) {
        console.log('Checking path exists or not ...');
        fs.stat(path, function (err, stats) {
            if (err) {
                console.log('Provided path does not exists creating it : ' + path);
                fs.mkdirSync(path);
            }
        });
    }

    static getFilesForGlobPattern(patterns, options) {
        let result = [];
        // Iterate over flattened patterns array.
        _.flattenDeep(patterns).forEach(function (pattern) {
            // If the first character is ! it should be omitted
            var exclusion = pattern.indexOf('!') === 0;
            // If the pattern is an exclusion, remove the !
            if (exclusion) {
                pattern = pattern.slice(1);
            }
            // Find all matching files for this pattern.
            var matches = _globSync(pattern, options);
            if (exclusion) {
                // If an exclusion, remove matching files.
                result = _.difference(result, matches);
            } else {
                // Otherwise add matching files.
                result = _.union(result, matches);
            }
        });
        return result;
    }

    static getJsFiles(options) {
        return getFilesForGlobPattern(['**/*.js'], options);
    }

    static getCssFiles(options) {
        return getFilesForGlobPattern(['**/*.css'], options);
    }
}

class Util {
    static formatString() {
        let str = '',
            params = [];
        if (arguments) {
            str = arguments[0];
            params = _.drop([].slice.call(arguments));
            for (let i = 0; i < params.length; i++) {
                str = str.replace(new RegExp('\\{' + i + '\\}', 'gi'),
                    params[i]);
            }
        }
        return str;
    }

    static removeUseStrict(src) {
        return src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g,
            '$1');
    }

    static stripBanner(src, options) {
        if (!options) {
            options = {};
        }
        let m = [];
        if (options.line) {
            // Strip // ... leading banners.
            m.push('(?:.*\\/\\/.*\\r?\\n)*\\s*');
        }
        if (options.block) {
            // Strips all /* ... */ block comment banners.
            m.push('\\/\\*[\\s\\S]*?\\*\\/');
        } else {
            // Strips only /* ... */ block comment banners, excluding /*! ...
            // */.
            m.push('\\/\\*[^!][\\s\\S]*?\\*\\/');
        }
        let re = new RegExp('^\\s*(?:' + m.join('|') + ')\\s*', '');
        return src.replace(re, '');
    }

    static compileLodashTemplate(template, options) {
        let compiled = _.template(template);
        return compiled(options);
    }

    static prependString(itemToSuffix, strToPrepend) {
        if (arguments.length !== 2) {
            return;
        }
        if (_.isArray(itemToSuffix)) {
            return _.map(itemToSuffix, function (item) {
                return item.indexOf(strToPrepend) !== -1 ? item : strToPrepend + item;
            });
        }
        return strToPrepend + itemToSuffix;
    }

    static globSync(pattern, options) {
        return glob.sync(pattern, options);
    }

    static isArray(obj) {
        return _.isArray(obj);
    }

    static runSpawn(done, task, optArg, optIo) {
        optArg = typeof optArg !== 'undefined' ? optArg : [];
        let processResponse = {};
        let child;
        let running = false;
        let stdio = 'inherit';
        if (optIo !== 'undefined') {
            stdio = optIo;
            child = spawn(task, optArg, {
                stdio: stdio
            });
        } else {
            child = spawn(task, optArg);
            let response = [];
            child.stdout.on('data', function (data) {
                console.log('data' + data);
                response.push(data);
            });
            processResponse.stdOut = response;

            var errResponse = [];
            child.stderr.on('data', function (data) {
                errResponse.push(data);
            });
            processResponse.stdErr = errResponse;
        }

        child.on('close', function () {
            console.log('Process Close');
            if (!running) {
                running = true;
                done();
            }
        });
        child.on('error', function () {
            console.log('An error has occurred while executing process');
            if (!running) {
                console.error('Encountered a child error');
                running = true;
                done();
            }
        });
        return processResponse;
    }
}

export {
    IoUtil,
    LogUtil,
    Util
};