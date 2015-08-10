angular.module('starter')
    .controller('KeywordsCtrl', function ($scope, $q, jPushService, keyWordsService) {
        var useCache = true;

        $scope.moreDataCanBeLoaded = true;
        var nextpage = true;

        keyWordsService.allKeywords(useCache).then(function (res) {
            //alert(res);

            console.log(JSON.stringify(res));
            $scope.keywords = res;
            //alert(res.length);
            if (res.length < 15) {
                $scope.moreDataCanBeLoaded = false;
            }
            else {
                $scope.moreDataCanBeLoaded = true;
            }
            keyWordsService.setKeywords(res);
        }, function (err) {
            alert(err);
        });

        $scope.loadMoreData = function () {

            //alert('loadmore');
            nextpage = true;
            keyWordsService.refreshKeywords(nextpage).then(function (res) {
                //alert(res);
                console.log('在controller中doRefresh的res' + JSON.stringify(res));


                $scope.keywords = $scope.keywords.concat(res);
                keyWordsService.setKeywords($scope.keywords);
                $scope.$broadcast('scroll.infiniteScrollComplete');
                if (res.length < 15) {
                    $scope.moreDataCanBeLoaded = false;
                } else {
                    $scope.moreDataCanBeLoaded = true;
                }
            }, function (err) {
                alert('网络问题');
                $scope.$broadcast('scroll.refreshComplete');

            });

        };

        $scope.doRefresh = function () {
            //alert('here');
            $scope.keywords = '';
            nextpage = false;
            keyWordsService.refreshKeywords(nextpage).then(function (res) {
                //alert(res);
                console.log('在controller中doRefresh的res' + JSON.stringify(res));

                /*                items=[{"id":51,"userId":"hahaha","jpushId":"","keyword":"阿的萨达","created_at":"2015-08-04 01:59:20","updated_at":"2015-08-04 01:59:20"}];
                 $scope.keywords = items.concat($scope.keywords);*/
                $scope.keywords = res;

                if (res.length < 15) {
                    $scope.moreDataCanBeLoaded = false;
                } else {
                    $scope.moreDataCanBeLoaded = true;
                }

                keyWordsService.setKeywords(res);

                //keyWordsService.setKeywords(res);
                $scope.$broadcast('scroll.refreshComplete');
            }, function (err) {
                alert('网络问题');
                $scope.keywords = err;
                $scope.$broadcast('scroll.refreshComplete');
            });

        };
        $scope.addKeyword = function (keyword) {

            keyWordsService.addKeyword(keyword).then(function (res) {
                //alert(res);
                console.log(JSON.stringify(res));
                $scope.keywords = res;

            }, function (err) {
                alert(err);
            });

        };
        $scope.remove = function (keyword) {
            //alert(keyword);

            keyWordsService.deleteKeyword(keyword).then(function (res) {
                //alert(res);

                //$scope.doRefresh();
                console.log(JSON.stringify(res));

            }, function (err) {
                //alert(err);
            });
        };


        $scope.getId = function () {


            jPushService.getId(function (data) {
                $scope.registerId = data;
                $scope.$apply();

            });
        };

    }
)
    .controller('KeywordsDetailCtrl', function ($scope, keyWordsService, $stateParams) {
        $scope.keyvalue = keyWordsService.get($stateParams.keywordId)

    })
    .controller('SettingCtrl', function ($scope, $ionicPopup, $ionicActionSheet, $timeout,Camera,$localstorage) {


        $scope.user = {};
        $scope.user.nickname='hahah';
        $scope.user.photo=$localstorage.get('userlogo') || 'img/car.jpg';
        $scope.user.ispush = true;
        $scope.$watch('user.ispush',function(){
            //alert($scope.user.ispush);
        });
        var cameraNow=function(){

            console.log('Getting camera');
            Camera.getPicture({
                quality: 75,
                targetWidth: 320,
                targetHeight: 320,
                saveToPhotoAlbum: false
            }).then(function(entry) {
                alert(entry.nativeURL);
                $scope.user.photo = entry.nativeURL;
                $localstorage.set('userlogo',entry.nativeURL);

            }, function(err) {
                console.log(err);
            });

        };
        var selectPicture=function(){

            console.log('Getting camera');
            Camera.getPicture({
                quality: 75,
                targetWidth: 320,
                targetHeight: 320,
                destinationType: navigator.camera.DestinationType.FILE_URI,
                sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
            }).then(function(entry) {

                $scope.user.photo = entry.nativeURL;
                $localstorage.set('userlogo',entry.nativeURL);
            }, function(err) {
                console.log(err);
            });
        };
        $scope.save=function(){
            var options = new FileUploadOptions();
            options.fileKey="file";
            options.fileName=$scope.user.photo.substr($scope.user.photo.lastIndexOf('/')+1);
            options.mimeType="image/jpeg";
            options.chunkedMode = false;
            var params = {};
            params.other = 'haha'; // some other POST fields
            options.params = params;

            //console.log("new imp: prepare upload now");
            var ft = new FileTransfer();
            ft.upload($scope.user.photo, encodeURI('http://172.25.206.1/jpushapi/upload'), uploadSuccess, uploadError, options);
            function uploadSuccess(r) {
                alert(r);
                // handle success like a message to the user
            }
            function uploadError(error) {
                alert(error);
                //console.log("upload error source " + error.source);
                //console.log("upload error target " + error.target);
            }
        };


        $scope.showPhoto= function(){

            var hideSheet = $ionicActionSheet.show({
                buttons: [
                    { text: 'Camera Now' },
                    { text: 'Use Your Gallery' }
                ],
                titleText: '',
                cancelText: 'Cancel',
                cancel: function() {
                    // add cancel code..
                },
                buttonClicked: function(index) {
                    //alert(index);
                    if(index == 0){
                        cameraNow();
                    }else if(index == 1){
                        selectPicture();
                    }
                    return true;
                }
            });

            // For example's sake, hide the sheet after two seconds
            $timeout(function() {
                hideSheet();
            }, 10000);

        };
        $scope.showInput = function (type) {
            if(type == 'nickname'){
                var useTemplate='<label class="item item-input"><input type="text" ng-model="user.nickname"></label>';
                var useTitle='Enter Your Nick Name';
                var useSubTitle='like CryBoy GrennTea such thing';
            }else if(type == 'phonenumber')
            {
                var useTemplate='<label class="item item-input"><input type="text" ng-model="user.phonenumber"></label>';
                var useTitle='Enter Your Phone Number';
                var useSubTitle='like 119 110 such thing';

            }
            var myPopup = $ionicPopup.show({
                template: useTemplate,
                title: useTitle,
                subTitle:useSubTitle,
                scope: $scope,
                buttons: [
                    {text: 'Cancel'},
                    {
                        text: '<b>Save</b>',
                        type: 'button-positive',
                        onTap: function (e) {
                            if(type == 'nickname'){
                                if (!$scope.user.nickname) {
                                    //don't allow the user to close unless he enters wifi password
                                    e.preventDefault();
                                } else {
                                    return $scope.user.nickname;
                                }

                            }else if(type == 'phonenumber'){
                                if (!$scope.user.phonenumber) {
                                    //don't allow the user to close unless he enters wifi password
                                    e.preventDefault();
                                } else {
                                    return $scope.user.phonenumber;
                                }

                            }

                        }
                    }
                ]
            });
        }

    })
    .controller('FindCtrl', function ($scope, $state, $ionicSlideBoxDelegate, AmapService) {


        var locationCallback = function (data) {
            console.log(data.position.getLng() + '  ' + data.position.getLat());
        };
        AmapService.init(locationCallback);


        $scope.navSlide = function (index) {
            $ionicSlideBoxDelegate.slide(index, 500);
        };

    })
    .controller('SplashCtrl', function ($scope, $state, $ionicSlideBoxDelegate, $localstorage) {

        var firstrun = $localstorage.get('firstRun') || 'nothing';
        //alert(firstrun);
        if (firstrun == 'no first') {
            $state.go('tab.keywords');

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
            $state.go('tab.keywords');
        };
    })
;