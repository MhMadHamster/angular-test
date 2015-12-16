var myApp = angular.module('myApp', ['ngRoute', 'ngResource']);

myApp.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'pages/main.html',
      controller: 'mainController'
    })
    .when('/forecast', {
      templateUrl: 'pages/forecast.html',
      controller: 'forecastController'
    })
    .when('/forecast/:days', {
      templateUrl: 'pages/forecast.html',
      controller: 'forecastController'
    });
});

myApp.service('city', function() {
  this.name = 'Moscow';
})

myApp.controller('mainController', ['$scope', 'city', function($scope, city) {
  $scope.city = city.name;

  $scope.$watch('city', function() {
    city.name = $scope.city;
  })
}]);

myApp.controller('forecastController', [
    '$scope',
    '$resource',
    '$routeParams',
    '$filter',
    'city',
    function($scope, $resource, $routeParams, $filter, city) {
  
  $scope.city = city.name;
  $scope.days = $routeParams.days || 1;
  $scope.convertTemperature = function(degK) {
    return Math.round(degK - 273);
  };
  $scope.toDate = function(dt) {
    return $filter('date')(new Date(dt * 1000), 'EEEE, MMM, yy');
  }

  $scope.weatherAPI = $resource('http://api.openweathermap.org/data/2.5/forecast/daily', 
    { callback: 'JSON_CALLBACK' },
    { get: {
        method: 'JSONP'
      }
    });

  $scope.weatherResult = $scope.weatherAPI.get({
    q: $scope.city,
    cnt: $scope.days,
    appid: '1c9a47b751e31563a1cc2befae7e7201'
  });

}]);