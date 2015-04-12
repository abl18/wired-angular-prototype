/*globals GridCtrl*/
/**
 * @func GridCtrl
 * @desc outputs data s slots
 * @ngInject // look into this grunt plugin for auto dependency management
 */

function GridCtrl($rootScope, $scope, localStorageService, /*$cacheFactory,*/ MainFactory) {
  $scope.articles = localStorageService.get($scope.section, $scope.articles) || undefined;

  $scope.retrieveDataAndState = function() {
    MainFactory.getData($scope.path).then(function(res) {

      if ($scope.section !== '') {
        $scope.articles = res.posts.slice(0, 10);
      } else {
        $scope.articles = res.slice(0, 10);
      }

      localStorageService.set($scope.section, $scope.articles);

      // if ($cacheFactory.get($scope.path) === undefined) {
      //   $cacheFactory($scope.path, $scope.articles);
      // }
    });
  };


  $rootScope.$watch('$stateParams.section', function() {
    $scope.section = $rootScope.$stateParams.section;

    if (typeof $scope.section !== 'undefined') {

      if ($scope.section !== '') {
        $scope.path = 'recent/subwired/' + $scope.section;
      }
      else {
        $scope.path = 'posts';
      }

      $scope.retrieveDataAndState();
    }
  });

}