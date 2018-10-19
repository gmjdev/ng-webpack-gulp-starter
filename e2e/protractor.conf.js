import {
  SpecReporter
}
from 'jasmine-spec-reporter';
import ProtractorUtil from '../util/protractor.util';

// const webDriverMngrPath = path.resolve(cwd, './node_modules/webdriver-manager');
// const seleniumServerJarLocation = ProtractorUtil.findSeleniumJarPath(webDriverMngrPath);
// seleniumServerJarLocation = './' + path.relative(__dirname, seleniumServerJarLocation);

export const config = {
  allScriptsTimeout: 11000,
  // seleniumServerJar: seleniumServerJarLocation,
  specs: [
    'C:\source\ng-webpack-gulp-starter\**\*.e2e.ts'
  ],
  capabilities: {
    'browserName': 'chrome',
    chromeOptions: {
      binary: process.env.CHROME_BIN,
      args: ['--no-sandbox']
    }
  },

  directConnect: true,

  baseUrl: 'http://localhost:4200/',

  framework: 'jasmine',

  jasmineNodeOpts: {
    showTiming: true,
    showColors: true,
    isVerbose: false,
    includeStackTrace: false,
    defaultTimeoutInterval: 60000,
    print: (msg) => console.log(msg),
  },

  onPrepare() {
    require('ts-node').register({
      project: 'e2e/tsconfig.e2e.json'
    });
    jasmine.getEnv().addReporter(new SpecReporter({
      spec: {
        displayStacktrace: true
      }
    }));
  }
};