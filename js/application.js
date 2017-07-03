var App;
(function () {
  App = angular.module('App', ['ngRoute']);

  App.run(['$rootScope', function ($rootScope) {
    var _getTopScope = function () {
      return $rootScope;
      //return angular.element(document).scope();
    };

    $rootScope.ready = function () {
      var $scope = _getTopScope();
      $scope.status = 'ready';
      if (!$scope.$$phase) $scope.$apply();
    };
    $rootScope.loading = function () {
      var $scope = _getTopScope();
      $scope.status = 'loading';
      if (!$scope.$$phase) $scope.$apply();
    };
    $rootScope.$on('$routeChangeStart', function () {
      _getTopScope().loading();
    });
  }]);

  App.controller('IndexCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.some_value = 'Val';
    $scope.ready();
    $scope.names = ['matias', 'val', 'mark'];
  }]);

  App.controller('VideosCtrl', ['$scope', '$http', 'slow', function ($scope, $http, isSlow) {
    var url = './data/videos.json';
    var timeout = isSlow ? 2000 : 1;
    $http.get(url).then(function (response) {
      setTimeout(function () {
        var feed = response.data['feed'];
        var entries = feed['entry'];
        $scope.videos = [];
        var from = 0;
        var to = entries.length / 2;
        if (isSlow) {
          from = to;
          to = entries.length;
        }
        for (var i = from; i < to; i++) {
          var entry = entries[i];
          $scope.videos.push(entry);
        };
        $scope.ready();
      }, timeout);
    });
  }]);

  App.config(['$routeProvider', '$locationProvider', function ($routes, $location) {

    $location.hashPrefix('!');

    $routes.when('/home', {
      controller: 'IndexCtrl',
      templateUrl: './pages/index.html'
    });

    $routes.when('/videos', {
      controller: 'VideosCtrl',
      templateUrl: './pages/videos.html',
      resolve: {
        slow: function () {
          return false;
        }
      }
    });

    $routes.when('/videos/slow', {
      controller: 'VideosCtrl',
      templateUrl: './pages/videos.html',
      resolve: {
        slow: function () {
          return true;
        }
      }
    });

    $routes.otherwise({
      redirectTo: '/home'
    });

  }]);

})();
