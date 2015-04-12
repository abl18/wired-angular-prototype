/*globals MainFactory, GridCtrl, CardCtrl, RecircCtrl, ReactCtrl, wtSection*/
/**
 * @name    Wired Angular App
 * @desc    Get our data out of the dom
 * @author  Ross Patton
 * @TODO better/pretty routing.
 * @TODO share more data between controllers (mostRec cards and mostRec feed)
 * @TODO implement testing
 */


'use strict';

/**
 * @func angular wrapper
 * @desc kicks off everything, sets dependencies
 * @ngInject // look into this grunt plugin for auto dependency management
 */
angular.
  module('wiredApp', ['ngSanitize', 'LocalStorageModule', 'ui.router', 'react']).
  controller('RecircCtrl', RecircCtrl).
  controller('GridCtrl', GridCtrl).
  controller('CardCtrl', CardCtrl).
  controller('ReactCtrl', ReactCtrl).
  factory('MainFactory', MainFactory).
  directive('wtSection', wtSection).
  run(
    [          '$rootScope', '$state', '$stateParams',
      function ($rootScope,   $state,   $stateParams) {

        // It's very handy to add references to $state and $stateParams to the $rootScope
        // so that you can access them from any scope within your applications.For example,
        // <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
        // to active whenever 'contacts.list' or one of its decendents is active.
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
      }
    ]
  ).
  config(function($stateProvider, $urlRouterProvider) {
      /*$locationProvider*/
      // default re-route
      $urlRouterProvider.otherwise('/');

      $stateProvider.
        state('section', {

          url: '/:section',
          views: {
            primary: {
              templateUrl: 'partials/grid/section/primary.html'
              // controller: 'PrimaryCtrl'
            },
            recircNews: {
              templateUrl: 'partials/recirc/latestNews.html',
              controller: 'RecircCtrl'
            },
            recircShared: {
              templateUrl: 'partials/recirc/latestNews.html',
              controller: 'RecircCtrl'
            },
            secondary: {
              templateUrl: 'partials/grid/section/secondary.html'
              // controller: 'SecondaryCtrl'
            },
            card: {
              templateUrl: 'partials/global/card.html',
              controller: 'CardCtrl'
            }
          }

        }).
        state('home', {

          url: '/',
          views: {
            primary: {
              templateUrl: 'partials/grid/home/primary.html'
              // controller: 'PrimaryCtrl'
            },
            recircNews: {
              templateUrl: 'partials/recirc/latestNews.html',
              controller: 'RecircCtrl'
            },
            recircShared: {
              templateUrl: 'partials/recirc/latestNews.html',
              controller: 'RecircCtrl'
            },
            secondary: {
              templateUrl: 'partials/grid/home/secondary.html'
              // controller: 'SecondaryCtrl'
            },
            card: {
              templateUrl: 'partials/global/card.html',
              controller: 'CardCtrl'
            }
          }
        });

      // $locationProvider.html5Mode(true);
      // $locationProvider.hashPrefix('!');
    }
  )
;

/** @jsx React.DOM */
// var HelloComponent = React.createClass({
//   propTypes: {
//     fname : React.PropTypes.string.isRequired,
//     lname : React.PropTypes.string.isRequired
//   },
//   render: function() {
//     return <span>Hello {this.props.fname} {this.props.lname}</span>;
//   }
// })
// app.value('HelloComponent', HelloComponent);





  // .config(['$routeProvider', function($routeProvider) {
  //   $routeProvider.
  //     when('/', {
  //       templateUrl: 'views/home.html',
  //       controller: 'GridCtrl'
  //     }).
  //     when('/:section', {
  //       templateUrl: 'views/section.html',
  //       controller: 'GridCtrl'
  //     }).
  //     otherwise({
  //       redirectTo: '/'
  //     });
  // }]);

// (function () {
  // 'use strict';
  // var app = angular.module('app');

  // /**
  //  * @class MainCtrl
  //  * @classdesc Main Controller for doing awesome things
  //  */
  // app.controller('MainCtrl', function($scope){
  //   var url = "http://stag.wired.com/wp-json/posts/";
  //   $scope.articles = {};

  //   $.getJSON(url, function(data) {
  //     $scope.articles = data;
  //     $scope.$broadcast('dataGet')
  //   })

  //   $scope.$on('dataGet', function() {
  //     console.dir($scope.articles);
  //   });
  // });

  // angular.module('app').controller('MainCtrl', MainCtrl);

// }());


// angular.module('app', [])
//   .controller('MainCtrl', function($scope) {
//     var url = "http://stag.wired.com/wp-json/posts/";
//     $scope.articles = {};

//     $.getJSON(url, function(data) {
//       $scope.articles = data;
//       $scope.$broadcast('dataGet')
//     })

//     $scope.$on('dataGet', function() {
//       console.dir($scope.articles);
//     });
//     // $scope.$watch(function() {
//     //   console.dir($scope.articles);
//     // });
//   });
//   // .config(['$routeProvider', function($routeProvider) {
  //   $routeProvider
  //     .when('/', {
  //       templateUrl: '/',
  //       controller: 'MainCtrl'
  //     })
  //     .otherwise({
  //       redirectTo: '/',
  //       controller: 'MainCtrl'
  //     });
  // }]);
