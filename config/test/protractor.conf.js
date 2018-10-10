import {
  SpecReporter
}
from 'jasmine-spec-reporter';

export const config = {
  allScriptsTimeout: 11000,
  specs: [
    'C:\source\ng-webpack-gulp-starter\**\*.e2e.ts'
  ],
  capabilities: {
    'browserName': 'chrome',
    // For Travis CI only
    chromeOptions: {
      binary: process.env.CHROME_BIN,
      args: ['--no-sandbox']
    }
  },
  directConnect: true,
  baseUrl: 'http://localhost:4200/',
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    print: function () {}
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