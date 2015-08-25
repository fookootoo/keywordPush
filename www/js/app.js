// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var jpushId='';
var deviceId='';
var userId='';
angular.module('starter', [
    'ionic',
    'tagcloud',
    'starter.controller',
    'starter.service',
    'starter.constant',
    'starter.controller.keyword',
    'starter.service.keyword',
    'starter.service.keywordDetail',
    'starter.controller.keywordDetail',
    'starter.controller.setting',
    'starter.controller.find'

])

   .config(['$ionicConfigProvider', function($ionicConfigProvider) {

        $ionicConfigProvider.tabs.position('bottom'); // other values: top

    }])
    .config(function($compileProvider){
        $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|blob|mailto|tel):|data:image\//);
    })

    .run(function ($ionicPlatform, jPushService,$state,$localstorage,userService) {
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
                 //app 是否处于正在运行状态
                 var isActive = notification.notification;
                 //ios
                 if (ionic.Platform.isIOS()) {
                 window.alert(notification);

                 } else {
                 window.alert(notification);
                 //非 ios(android)
                 }*/
            };
            var onGetRegistradionID=function(data){
                jpushId=data;

                window.plugins.uniqueDeviceID.get(function(deviceid){
                    deviceId=deviceid;

                    userService.firstReg().then(function(userid){
                        userId=userid;
                        $localstorage.set('jpushid',data);
                        $localstorage.set('deviceid',deviceid);
                        $localstorage.set('userid',userid);
                    })

                }, function(error){alert(error);});

            };



            jPushService.init(notificationCallback);
            jpushId=$localstorage.get('jpushid') || 'nothing';
            deviceId=$localstorage.get('deviceid') || 'nothing';
            userId=$localstorage.get('userid') || 12;
            //alert(deviceId);
            if((jpushId == 'nothing') ||(deviceId == 'nothing') ){
                jPushService.getId(onGetRegistradionID);
            }


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
                        templateUrl: 'js/keyword/keywordIndex.html',
                        controller: 'KeywordsCtrl'
                    }
                }
            })
            .state('tab.keywords-detail', {
                url: '/keywords/:keywordId',
                views: {
                    'tab-keywords': {
                        templateUrl: 'js/keyword-detail/keywordDetail.html',
                        controller: 'KeywordsDetailCtrl'
                    }
                }
            })

            .state('tab.find', {
                url: '/find',
                views: {
                    'tab-find': {
                        templateUrl: 'js/find/find.html',
                        controller: 'FindCtrl'
                    }
                }
            })


            .state('tab.setting', {
                url: '/setting',
                views: {
                    'tab-setting': {
                        templateUrl: 'js/setting/setting.html',
                        controller: 'SettingCtrl'
                    }
                }
            })

        ;

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/splash');

    })
    .directive('hideMore', function($rootScope) {
        return {
            restrict: 'A',
            link: function($scope, $el) {

                $rootScope.hideMore = true;
                $scope.$on('$destroy', function() {
                    $rootScope.hideMore = false;
                });

            }
        };
    });






