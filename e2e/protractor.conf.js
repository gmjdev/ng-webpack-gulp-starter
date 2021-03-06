import {
    SpecReporter
} from 'jasmine-spec-reporter';
import {
    LogUtil,
    IoUtil
} from '../util/util';
import path from 'path';
import {
    JUnitXmlReporter
} from 'jasmine-reporters';
import HtmlReporter from 'protractor-beautiful-reporter';

const cwd = process.cwd();
const appConfig = IoUtil.readJsonFile(path.join(cwd, 'app-config.json'));
const e2eReportPath = path.join(cwd, appConfig.source.buildDir,
    appConfig.source.reportsDir, appConfig.source.e2eDir);

const reporters = [
    new SpecReporter({
        spec: {
            displayStacktrace: true
        }
    }),
    new JUnitXmlReporter({
        consolidateAll: true,
        savePath: e2eReportPath,
        filePrefix: appConfig.test.e2e.junitFilePrefix
    }),
    new HtmlReporter({
        baseDirectory: path.join(e2eReportPath, 'html'),
        screenshotsSubfolder: 'screenshots',
        jsonsSubfolder: 'json',
        excludeSkippedSpecs: false,
        takeScreenShotsOnlyForFailedSpecs: true,
        preserveDirectory: false,
        docName: appConfig.test.e2e.htmlReportFileName,
        docTitle: appConfig.test.e2e.htmlReportTitle
    }).getJasmine2Reporter()
];

const protractorConfig = {
    allScriptsTimeout: 11000,
    specs: appConfig.test.e2e.specFile,
    capabilities: {
        'browserName': appConfig.test.e2e.browser,
        chromeOptions: {
            binary: process.env.CHROME_BIN,
            args: ['--no-sandbox']
        }
    },
    directConnect: true,
    baseUrl: appConfig.test.e2e.baseUrl,
    framework: 'jasmine2',
    jasmineNodeOpts: {
        showTiming: true,
        showColors: true,
        isVerbose: false,
        includeStackTrace: false,
        defaultTimeoutInterval: 60000,
        print: (msg) => LogUtil.info(msg),
    },
    onPrepare() {
        require('ts-node').register({
            project: path.join(cwd, appConfig.source.e2eDir, appConfig.test.e2e.tsConfigFile)
        });
        reporters.forEach((value) => jasmine.getEnv().addReporter(value));
    }
};

export const config = protractorConfig;