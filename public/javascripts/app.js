'use strict';
angular.module('codeChallenge', ['ngRoute', 'codeChallenge.controllers','codeChallenge.filters', 'codeChallenge.services', 'codeChallenge.directives']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $locationProvider.hashPrefix('!');

    $routeProvider.
      when('/', {
        templateUrl: 'partials/city/index',
        controller: "IndexCtrl"
      }).
      when('/addCity', {
        templateUrl: 'partials/city/add',
        controller: "AddCityCtrl"
      }).
      when('/readCity/:id', {
        templateUrl: 'partials/city/read',
        controller: "ReadCityCtrl"
      }).
      when('/editCity/:id', {
        templateUrl: 'partials/city/edit',
        controller: "EditCityCtrl"
      }).
      when('/deleteCity/:id', {
        templateUrl: 'partials/city/delete',
        controller: "DeleteCityCtrl"
      }).
      otherwise({
        redirectTo: '/'
      });
      //$locationProvider.html5Mode(true);
  }])
  .config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
        key: "AIzaSyCpzkjorp2WUSJ9vh3KosdwgFkxSCdN9PM",
        v: '3.20', //defaults to latest 3.X anyhow
        libraries: 'weather,geometry,visualization'
    });
});

