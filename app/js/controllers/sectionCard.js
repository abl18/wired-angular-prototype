/*globals CardCtrl*/
/**
 * @func CardCtrl
 * @desc outputs section data to cards. ex, the prefoote
 * @ngInject // look into this grunt plugin for auto dependency management
 */

function CardCtrl($scope, localStorageService, MainFactory) {
  var path = 'recent/subwired/' + $scope.section;
  $scope.articles = localStorageService.get('card' + $scope.section) || undefined;

  if (typeof $scope.articles === 'undefined' && typeof $scope.section !== 'undefined') {
    MainFactory.getData(path).then(function(res) {
      $scope.articles = res.posts.slice(0, 3);
      localStorageService.set('card' + $scope.section, $scope.articles);
    });
  }
}