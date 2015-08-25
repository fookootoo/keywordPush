angular.module('starter.controller',[])



    .controller('SplashCtrl', function ($scope, $state, $ionicSlideBoxDelegate, $localstorage) {


        var firstrun = $localstorage.get('firstRun') || 'nothing';
        //alert(firstrun);
        if (firstrun == 'no first') {
            $state.go('tab.keywords');
            //$localstorage.clear();

        } else {
            $localstorage.set('firstRun', 'no first');
        }

        $scope.navSlide = function (index) {
            //alert(index);
            $ionicSlideBoxDelegate.slide(index, 500);
        };
        $scope.slideChanged = function (index) {

            $scope.slideIndex = index;
        };
        $scope.onSwipeLeft = function () {
            alert('here');
            $state.go('tab.keywords');
        };
    })
;