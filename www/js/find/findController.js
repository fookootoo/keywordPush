angular.module('starter.controller.find',[])
    .controller('FindCtrl', function ($scope, $state, $ionicSlideBoxDelegate, AmapService) {


        var locationCallback = function (data) {
            console.log(data.position.getLng() + '  ' + data.position.getLat());
        };
        AmapService.init(locationCallback);


        $scope.navSlide = function (index) {
            $ionicSlideBoxDelegate.slide(index, 500);
        };

    })