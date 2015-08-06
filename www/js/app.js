// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var jpushId='';
angular.module('starter', ['ionic'])

   .config(['$ionicConfigProvider', function($ionicConfigProvider) {

        $ionicConfigProvider.tabs.position('bottom'); // other values: top

    }])

    .run(function ($ionicPlatform, jPushService,$state,$localstorage) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }


            var notificationCallback = function (data) {
                console.log('received data :' + data);
                alert(data);
                var message = angular.fromJson(data);
                alert(message.alert);
                /* var notification = angular.fromJson(data);
                 //app �Ƿ�����������״̬
                 var isActive = notification.notification;
                 //ios
                 if (ionic.Platform.isIOS()) {
                 window.alert(notification);

                 } else {
                 window.alert(notification);
                 //�� ios(android)
                 }*/
            };
            var onGetRegistradionID=function(data){
                jpushId=data;
            };

            jPushService.init(notificationCallback);
            jPushService.getId(onGetRegistradionID);


        });
    }) .config(function($stateProvider, $urlRouterProvider) {

        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider

            .state('splash', {
                url: "/splash",
                templateUrl: "splash.html",
                controller:'SplashCtrl'
            })

            // setup an abstract state for the tabs directive
            .state('tab', {
                url: "/tab",
                abstract: true,
                templateUrl: "templates/tabs.html"
            })

            // Each tab has its own nav history stack:

            .state('tab.keywords', {
                url: '/keywords',
                views: {
                    'tab-keywords': {
                        templateUrl: 'templates/keywords.html',
                        controller: 'KeywordsCtrl'
                    }
                }
            })
            .state('tab.keywords-detail', {
                url: '/keywords/:keywordId',
                views: {
                    'tab-keywords': {
                        templateUrl: 'templates/keywords-detail.html',
                        controller: 'KeywordsDetailCtrl'
                    }
                }
            })

            .state('tab.find', {
                url: '/find',
                views: {
                    'tab-find': {
                        templateUrl: 'templates/find.html',
                        controller: 'FindCtrl'
                    }
                }
            })


            .state('tab.setting', {
                url: '/setting',
                views: {
                    'tab-setting': {
                        templateUrl: 'templates/setting.html',
                        controller: 'SettingCtrl'
                    }
                }
            })

        ;

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/splash');

    });


;


;
