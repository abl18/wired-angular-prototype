module.exports = function(config) {
  'use strict';

  config.set({

    basePath : '../',

    files : [
      'bower_components/jquery2/jquery.min.js',
      'bower_components/lodash/dist/lodash.compat.min.js',
      'bower_components/angular/angular.min.js',
      'bower_components/angular-sanitize/angular-sanitize.min.js',
      'bower_components/ui-router/release/angular-ui-router.min.js',
      'bower_components/angular-local-storage/angular-local-storage.min.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'test/mocks/stateMock.js',
      'app/js/dist/app.js',
      'test/unit/**/*.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

    plugins : [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};