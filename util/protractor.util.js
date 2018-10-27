import * as find from 'find';

export default class ProtractorUtil {
    static isWebpackDevServer() {
        return process.argv[1] && !!(/webpack-dev-server/.exec(process.argv[1]));
    }

    static getProtractorCli() {
        let result = require.resolve('protractor');
        if (result) {
            return result.replace('index', 'cli');
        } else {
            throw new Error('Please check whether protractor is installed or not.');
        }
    }

    static isSeleniumServerAndDriverAvailable() {
        let available = false;
        // console.log('Checking selenium server and driver files are available.');
        return available;
    }

    static findSeleniumJarPath(directory, jarRegEx) {
        if (!jarRegEx) {
            jarRegEx = /\.jar$/ig;
        }
        let files = find.fileSync(jarRegEx, directory);
        return files[files.length - 1];
    }
}