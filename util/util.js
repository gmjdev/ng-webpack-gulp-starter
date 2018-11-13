import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import {
    spawn
} from 'child_process';
import * as _ from 'lodash';
import {
    glob
} from 'glob';
import mkdirp from 'mkdirp';

const cwd = process.cwd();
const _root = path.resolve(__dirname, '..');


class LogUtil {
    /* eslint-disable no-console */
    static error(task, msg) {
        if (arguments.length === 1) {
            console.log(chalk.redBright(msg));
        } else {
            console.log(chalk.redBright(`[${arguments[0]}] `) + arguments[1]);
        }
    }

    static success(msg) {
        if (arguments.length === 1) {
            console.log(chalk.green(msg));
        } else {
            console.log(chalk.green(`[${arguments[0]}] `) + arguments[1]);
        }
    }

    static warning(msg) {
        if (arguments.length === 1) {
            console.log(chalk.red(msg));
        } else {
            console.log(chalk.red(`[${arguments[0]}] `) + arguments[1]);
        }
    }

    static info(msg) {
        if (arguments.length === 1) {
            console.log(chalk.yellowBright(msg));
        } else {
            console.log(chalk.yellowBright(`[${arguments[0]}] `) + arguments[1]);
        }
    }
    /* eslint-enable no-console */
}

class IoUtil {
    static readFile(filePath, charset) {
        if (!fs.existsSync(filePath)) {
            throw new Error('File does not exists: ' + filePath);
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
            a = 0,
            opt = '',
            thisOpt = '',
            curOpt = '';
        for (; a < argument.length; a++) {
            thisOpt = argument[a].trim();
            opt = thisOpt.replace(/^-+/, '');

            if (opt === thisOpt) {
                if (curOpt) {
                    arg[curOpt] = opt;
                }
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
        let exists = _.find(Object.keys(availableEnvironment), (key) => {
            validEnv.push(availableEnvironment[key].toLowerCase());
            return availableEnvironment[key].toLowerCase() === env.toLowerCase();
        });

        if (!exists) {
            throw new Error(chalk.red('Unsupported environment is specified, ' +
                    'please specify valid environments from: ') +
                chalk.green(JSON.stringify(validEnv)));
        }
        return exists;
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

    static mkDirIfNotExists(dir) {
        LogUtil.info('Checking path exists or not ...');
        fs.stat(dir, function (err) {
            if (err) {
                LogUtil.error('Provided path does not exists creating it : ' + dir);
                fs.mkdirSync(dir);
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
            var matches = IoUtil.globSync(pattern, options);
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
        return IoUtil.getFilesForGlobPattern(['**/*.js'], options);
    }

    static getCssFiles(options) {
        return IoUtil.getFilesForGlobPattern(['**/*.css'], options);
    }

    static writeFile(filePath, data, charset = 'utf8') {
        const parentDir = path.dirname(filePath);
        if (!fs.existsSync(parentDir)) {
            mkdirp.sync(parentDir, (err) => {
                if (err) {
                    throw new Error('Unable to create directory: ' + err);
                }
            });
        }
        fs.writeFileSync(filePath, data, {
            encoding: charset,
            flag: 'w'
        });
    }

    static globSync(pattern, options) {
        return glob.sync(pattern, options);
    }

    static isDirectoryEmpty(directory) {
        fs.readdir(directory, function (err, files) {
            if (err) {
                throw new Error(`Unable to validate directory, ${err}`);
            }
            if (!err && files && files.length > 0) {
                return true;
            }
        });
        return false;
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
            return '';
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
        let child = {};
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
                LogUtil.info('Data ${data}');
                response.push(data);
            });
            processResponse.stdOut = response;

            var errResponse = [];
            child.stderr.on('data', function (data) {
                errResponse.push(data);
            });
            processResponse.stdErr = errResponse;
        }

        child.on('close', () => {
            LogUtil.info('Process Close');
            if (!running) {
                running = true;
                done();
            }
        });
        child.on('error', () => {
            LogUtil.info('An error has occurred while executing process');
            if (!running) {
                LogUtil.error('Encountered a child error');
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