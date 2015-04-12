/*globals MainFactory*/

/**
* @func MainFactory
* @funcdesc Get Data
* @ngInject // look into this grunt plugin for auto dependency management
*/
function MainFactory($q, $http) {
  var url = 'http://www.wired.com/wp-json/';

  var getData = function(path) {
    return $http.get(url + path, { cache: true }).then(function(response) {
      if (typeof response.data === 'object') {
        return response.data;
      } else {
        // invalid response
        return $q.reject(response.data);
      }
    }, function(response) {
      // something went wrong
      return $q.reject(response.data);
    });
  };

  return {
    'getData': getData
  };
}