/*globals RecircCtrl*/
/**
 * @func RecircCtrl
 * @desc outputs data for recirc cards (most recent, most shared, etc)
 * @ngInject // look into this grunt plugin for auto dependency management
 */
function RecircCtrl($scope, localStorageService, MainFactory) {
  $scope.recirc = localStorageService.get('recirc') || undefined;

  RecircCtrl.retrieveDataAndState = function() {
    MainFactory.getData('posts').then(function(res) {
      $scope.recirc = res.slice(0, 5);
      localStorageService.set('recirc', $scope.recirc);
      // return $scope.recirc;
    });
  };

  // console.log($scope.retrieveDataAndState);
  console.log(RecircCtrl.retrieveDataAndState);

  // if data hasn't been got, get it
  if (typeof $scope.recirc === 'undefined') {
    RecircCtrl.retrieveDataAndState();
  }
}