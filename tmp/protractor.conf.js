"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.config = void 0;var _jasmineSpecReporter = require("jasmine-spec-reporter");



var _protractor = _interopRequireDefault(require("../../util/protractor.util"));
var _seleniumWebdriver = require("selenium-webdriver");function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _readOnlyError(name) {throw new Error("\"" + name + "\" is read-only");}



var webDriverMngrPath = path.resolve(cwd, './node_modules/webdriver-manager');
var seleniumServerJarLocation = _protractor.default.findSeleniumJarPath(webDriverMngrPath);
seleniumServerJarLocation = (_readOnlyError("seleniumServerJarLocation"), './' + path.relative(__dirname, seleniumServerJarLocation));

var config = {
  allScriptsTimeout: 11000,
  seleniumServerJar: seleniumServerJarLocation,
  specs: [
  'C:\source\ng-webpack-gulp-starter\**\*.e2e.ts'],

  capabilities: {
    'browserName': 'chrome',
    chromeOptions: {
      binary: process.env.CHROME_BIN,
      args: ['--no-sandbox'] } },



  directConnect: true,

  baseUrl: 'http://localhost:4200/',

  framework: 'jasmine',

  jasmineNodeOpts: {
    showTiming: true,
    showColors: true,
    isVerbose: false,
    includeStackTrace: false,
    defaultTimeoutInterval: 60000,
    print: function print(msg) {return console.log(msg);} },


  onPrepare: function onPrepare() {
    require('ts-node').register({
      project: 'e2e/tsconfig.e2e.json' });

    jasmine.getEnv().addReporter(new _jasmineSpecReporter.SpecReporter({
      spec: {
        displayStacktrace: true } }));


  } };exports.config = config;