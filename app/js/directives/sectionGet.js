/*globals wtSection*/
/**
 * @func CardCtrl
 * @desc outputs section data to cards. ex, the prefoote
 * @ngInject // look into this grunt plugin for auto dependency management
 */

function wtSection() {
  return {
    controller: function ($scope, $element, $attrs) {
      $scope.section = $attrs.section;
      return $scope.section;
    }
  };
}