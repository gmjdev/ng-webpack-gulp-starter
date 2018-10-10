"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.config = void 0;var _jasmineSpecReporter = require("jasmine-spec-reporter");




var config = {
  allScriptsTimeout: 11000,
  specs: [
  'C:\source\ng-webpack-gulp-starter\**\*.e2e.ts'],

  capabilities: {
    'browserName': 'chrome',
    // For Travis CI only
    chromeOptions: {
      binary: process.env.CHROME_BIN,
      args: ['--no-sandbox'] } },


  directConnect: true,
  baseUrl: 'http://localhost:4200/',
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    print: function print() {} },

  onPrepare: function onPrepare() {
    require('ts-node').register({
      project: 'e2e/tsconfig.e2e.json' });

    jasmine.getEnv().addReporter(new _jasmineSpecReporter.SpecReporter({
      spec: {
        displayStacktrace: true } }));


  } };exports.config = config;