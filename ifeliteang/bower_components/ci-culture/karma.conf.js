// Karma configuration
// Generated on Mon Jul 06 2015 13:02:49 GMT-0300 (ART)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'bower_components/angular/angular.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/angular-translate/angular-translate.js',
      'bower_components/angular-cookies/angular-cookies.js',
      'bower_components/angular-translate-handler-log/angular-translate-handler-log.js',
      'bower_components/angular-translate-loader-url/angular-translate-loader-url.js',
      'bower_components/angular-ui-router/release/angular-ui-router.js',
      'bower_components/lodash/lodash.js',
      'bower_components/ci-utils/src/utils.service.js',
      'bower_components/ci-http/src/http.service.js',
      '../ci_translate/src/translate.service.js',
      'src/culture.mock.js',
      'src/culture.service.js',
      'src/*.*.js'
    ],


    // list of files to exclude
    exclude: [

    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'src/!(*spec|*oldie|*main|*mock|*new|index|*external).js': ['coverage']
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  })
}
