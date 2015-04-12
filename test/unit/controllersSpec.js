'use strict';

/* jasmine specs for controllers go here */
// describe('Unit: Controllers', function() {

describe('wiredApp', function() {

  // var serviceMock;

  beforeEach(function () {
    module('wiredApp');
    // module('stateMock');

    // serviceMock = spyOn('MainFactory', ['getData']);
  });


  describe('RecircCtrl', function() {
    var scope, ctrl;

    beforeEach(inject(function($rootScope, $controller) {
      scope = $rootScope.$new();
      ctrl = $controller('RecircCtrl', {
        $scope: scope
      });
    }));

    it('should be undefined by default', function() {
      expect(scope.recirc).toBeUndefined();
    });

  });


  describe('GridCtrl', function() {
    var scope, ctrl;

    beforeEach(inject(function($rootScope, $controller) {
      scope = $rootScope.$new();
      ctrl = $controller('GridCtrl', {
        $scope: scope
      });
    }));

    it('should be undefined by default', function() {
      expect(scope.articles).toBeUndefined();
    });

  });


  describe('CardCtrl', function() {
    var scope, ctrl;

    beforeEach(inject(function($rootScope, $controller) {
      scope = $rootScope.$new();
      ctrl = $controller('CardCtrl', {
        $scope: scope
      });
    }));

    it('should be undefined by default', function() {
      expect(scope.articles).toBeUndefined();
    });

  });


});







  // it('should set data to "things and stuff"', function() {
  //   expect($scope.articles).toBeUndefined();
  // });



      // var reqHandler;
      // httpBackend = _$httpBackend_;
      // httpBackend.expectGET('http://www.wired.com/wp-json/posts').
      //   respond([{name: 'Nexus S'}, {name: 'Motorola DROID'}]);
      //
      // console.log(MainFactory.getData);
      // spyOn(MainFactory, 'getData').and.returnValue(deferred.promise);

      // set up the returns for our someServiceMock
      // $q.when('weee') creates a resolved promise to "weee".
      // this is important since our service is async and returns
      // a promise.
      // serviceMock.getData.andReturn($q.when('weee'));

      // reqHandler = httpBackend.when('GET', 'http://www.wired.com/wp-json/posts');
      // reqHandler.respond(200, JSON);
    // inject the $controller and $rootScope services
    // in the beforeEach block
   //  beforeEach(inject(function($state, $injector, $httpBackend, $rootScope, $controller) {
   //    // httpBackend = $httpBackend;
   //    $httpBackend = $injector.get('$httpBackend');
   //    state = $state;
   //    // $httpBackend = $injector.get('$httpBackend');
   //    // $httpBackend.whenGET('partials/grid/section/primary.html').passThrough();
   //    // httpBackend.expectGET('http://www.wired.com/wp-json/posts').respond({});

   //    // Create a new scope that's a child of the $rootScope
   //    // scope = $rootScope.$new();
   //    $rootScope = $injector.get('$rootScope');
   //    // Create the controller
   //    $controller = $injector.get('$controller');

   //    createController = function() {
   //      return $controller('RecircCtrl', {$scope: scope});
   //    };
   //  }));

   //  afterEach(function() {
   //   $httpBackend.verifyNoOutstandingExpectation();
   //   $httpBackend.verifyNoOutstandingRequest();
   // });

    // it('should create a recirc model with 5 articles fetched from xhr', function() {
      // expect(scope.recirc).toBeUndefined();

      // $httpBackend.expect('GET', 'http://www.wired.com/wp-json/posts')
        // .respond({'success': true});

      // $httpBackend.flush();

      // expect(scope.recirc).toBeDefined();

      // // have to use $apply to trigger the $digest which will
      // // take care of the HTTP request
      // $rootScope.$apply(function() {
      //   $rootScope.retrieveDataAndState();
      // });

      // // expect(scope.parseOriginalUrlStatus).toEqual('calling');

      // httpBackend.flush();


      // expect(scope.recirc).toBeDefined();

      // // scope.retrieveDataAndState();
      // expect(scope.articles).toBeDefined();
    // });
  // });
// });
// describe('Unit: GridCtrl', inject(function($controller) {
//   beforeEach(module('wiredApp'));

//   var scope = {},
//       ctrl = $controller('GridCtrl', {$scope:scope});

//   it('should create articles model with 10 articles fetched from xhr', function() {
//     expect(scope.articles.length).toBe(5);
//   });

// }));
// describe('Wired App Controllers', function() {

//   // beforeEach(module('wiredApp'));
//   // beforeEach(function() { module('wiredApp'); });

//   describe('GridCtrl', inject(function($controller) {
//     var scope = {},
//         ctrl = $controller('GridCtrl', {$scope:scope});

//     it('should create articles model with 10 articles fetched from xhr', function() {
//       expect(scope.articles.length).toBe(5);
//     });

//   }));

// });
