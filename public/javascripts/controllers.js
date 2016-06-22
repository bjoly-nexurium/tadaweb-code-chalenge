'use strict';
angular.module('codeChallenge.controllers', ['uiGmapgoogle-maps', 'ui.bootstrap'])
        .controller('SearchCtrl', function ($scope, $http, $location) {
            var _selected;

            $scope.selected = undefined;
            $scope.getLocation = function (val) {
                return $http.get('/api/cities/autocomplete/' + val)
                        .then(function (response) {
                            return response.data.map(function (item) {
                                return item;
                            });
                        });
            };
            $scope.onSelect = function ($item, $model, $label) {
                $location.url('/readCity/' + $item._id);
            };
        })
        .controller('IndexCtrl', function ($scope, $http) {
            $scope.totalCities;
            $scope.itemsPerPage = $scope.viewby = 10;
            $scope.currentPage = 0;
            $scope.maxSize = 5; //Nu


            $scope.pageChanged = function () {
                $scope.getCities();
            };

            $scope.getCities = function () {
                $http.get('/api/cities/page/' + $scope.currentPage + '/perPage/' + $scope.itemsPerPage).
                        success(function (data, status, headers, config) {
                            $scope.totalCities = data.totalCities;
                            $scope.data = data.cities;
                        });
            }
            $scope.setItemsPerPage = function (num) {
                $scope.itemsPerPage = num;
                $scope.currentPage = 1; //reset to first paghe
                $scope.getCities();

            }
            $scope.getCities();
        })
        .controller('AddCityCtrl', function ($scope, $http, $location) {
            $scope.form = {};
            $scope.submitCity = function () {
                $http.post('/api/cities', $scope.form).
                        success(function (data) {
                            $location.path('/');
                        });
            };
        })
        .controller('ReadCityCtrl', function ($scope, $http, $routeParams) {
            $scope.map = {center: {latitude: 43, longitude: 80}, zoom: 2};

            $http.get('/api/cities/' + $routeParams.id).
                    success(function (data) {
                        $scope.city = data;
                        $scope.map = {center: {latitude: data.lat, longitude: data.long}, zoom: 6};
                        $scope.options = {scrollwheel: false, draggable: false};
                        $scope.marker = {
                            id: 0,
                            coords: {
                                latitude: data.lat,
                                longitude: data.long
                            },
                            options: {draggable: false}
                        };
                    });
        })
        .controller('EditCityCtrl', function ($scope, $http, $location, $routeParams) {
            $scope.form = {};
            $http.get('/api/cities/' + $routeParams.id).
                    success(function (data) {
                        $scope.form = data;
                    });

            $scope.editCity = function () {
                $http.put('/api/cities/' + $routeParams.id, $scope.form).
                        success(function (data) {
                            $location.url('/readCity/' + $routeParams.id);
                        });
            };
        })
        .controller('DeleteCityCtrl', function ($scope, $http, $location, $routeParams) {
            $http.get('/api/cities/' + $routeParams.id).
                    success(function (data) {
                        $scope.city = data.city;
                    });

            $scope.deleteCity = function () {
                $http.delete('/api/cities/' + $routeParams.id).
                        success(function (data) {
                            $location.url('/');
                        });
            };

            $scope.home = function () {
                $location.url('/');
            };
        });

