// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('housediary', ['ionic','housediary.controllers'])

    .run(function ($rootScope, $ionicPlatform, $state, $window) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });

        $rootScope.$on('$stateChangeStart', function (event, toState) {
//            if (toState.name !== "app.login" && toState.name !== "app.logout" && !$window.sessionStorage['fbtoken']) {
//                $state.go('app.login');
//                event.preventDefault();
//            }
        });

        $rootScope.$on('OAuthException', function () {
            $state.go('app.login');
        });
    })

    .config(function($stateProvider, $urlRouterProvider){
        $stateProvider

            .state('app', {
                url: "/app",
                abstract: true,
                templateUrl: "views/menu.html",
                controller: "MenuCtrl"
            })

            .state('app.home', {
                url: "/home",
                views: {
                    'menuContent': {
                        templateUrl: "views/home.html",
                        controller: "HomeCtrl"
                    }
                }
            })

            .state('app.login', {
                url: "/login",
                views: {
                    'menuContent': {
                        templateUrl: "views/login.html",
//                        controller: "LoginCtrl"
                    }
                }
            })

            .state('app.logout', {
                url: "/logout",
                views: {
                    'menuContent': {
                        templateUrl: "views/logout.html",
//                        controller: "LogoutCtrl"
                    }
                }
            });

        $urlRouterProvider.otherwise('/app/home');

    });
