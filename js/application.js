var App;
(function () {
  App = angular.module('App', ['ngRoute']);
  var orgTitle = document.title;
  var orgMeta;
  var pageDescription = document.querySelector('meta[name=description]');
  orgMeta = pageDescription.content;

  App.run(['$rootScope', '$timeout', function ($rootScope, $timeout) {
    $rootScope.ready = function () {
      $rootScope.status = 'ready';
      if (!$rootScope.$$phase) $rootScope.$apply();
    };
    $rootScope.loading = function () {
      $rootScope.status = 'loading';
      if (!$rootScope.$$phase) $rootScope.$apply();
    };
    $rootScope.$on('$routeChangeStart', function () {
      $rootScope.loading();
      $timeout(function () {
        var h1 = document.querySelector('h1');
        var p = document.querySelector('h1 + p.lead');
        if (h1) {
          document.title = h1.textContent + ' :: ' + orgTitle;
        } else {
          document.title = orgTitle;
        }
        pageDescription.content = (p && p.textContent + ' injected with script') || orgMeta;
      }, 100, false);
    });
  }]);

  App.controller('IndexCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.some_value = 'Val';
    $scope.ready();
    $scope.names = ['matias', 'val', 'mark'];
  }]);

  App.controller('VideosCtrl', ['$scope', '$http', 'fetchDelay', function ($scope, $http, fetchDelay) {
    var url = './data/videos.json';
    $scope.fetchDelay = fetchDelay;
    $http.get(url).then(function (response) {
      setTimeout(function () {
        var feed = response.data['feed'];
        var entries = feed['entry'];
        $scope.videos = [];
        var from = 0;
        var to = Math.floor(entries.length / 3);
        if (fetchDelay > 3000) {
          from = Math.ceil(to * 2);
          to = entries.length;
        } else if (fetchDelay > 500) {
          from = to;
          to = 2 * (entries.length / 3);
        }
        for (var i = from; i < to; i++) {
          var entry = entries[i];
          $scope.videos.push(entry);
        };
        $scope.ready();
      }, fetchDelay);
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
        fetchDelay: function () {
          return 1;
        }
      }
    });

    $routes.when('/videos/slow', {
      controller: 'VideosCtrl',
      templateUrl: './pages/videos.html',
      resolve: {
        fetchDelay: function () {
          return 1000;
        }
      }
    });

    $routes.when('/videos/super-slow', {
      controller: 'VideosCtrl',
      templateUrl: './pages/videos.html',
      resolve: {
        fetchDelay: function () {
          return 5000;
        }
      }
    });

    $routes.otherwise({
      redirectTo: '/home'
    });

  }]);

})();
