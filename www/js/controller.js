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
    .controller('SettingCtrl', function ($scope, $ionicPopup, $ionicActionSheet, $timeout,Camera,$localstorage,userService) {



        var defaultUser={
            nickName:'',
            photoName:'img/car.jpg',
            phoneNumber:'',
            isPush:true

        };

        function saveUser(){

            $localstorage.setObject('userinfo',$scope.user);
            userService.saveUser($scope.user,$scope.user.id).then(
                function(res){
                    console.log('save success')
                },
                function(error){
                    alert('save faile'+error);
                }

            );
        }
        function savePhoto(id){
            var options = new FileUploadOptions();
            options.fileKey="file";
            options.fileName=$scope.user.photoName.substr($scope.user.photoName.lastIndexOf('/')+1);
            options.mimeType="image/jpeg";
            options.chunkedMode = false;
            var params = {};
            params.userId = id; // some other POST fields
            options.params = params;

            //console.log("new imp: prepare upload now");
            var ft = new FileTransfer();
            ft.upload(
                $scope.user.photoName,
                encodeURI('http://172.25.206.1/jpushapi/upload'),
                uploadSuccess,
                uploadError,
                options);
            function uploadSuccess(r) {
                console.log('suceess');
                alert(r);
                // handle success like a message to the user
            }
            function uploadError(error) {
                alert(error);
                //console.log("upload error source " + error.source);
                //console.log("upload error target " + error.target);
            }
        }





        $scope.user = $localstorage.getObject('userinfo') ;
        if($scope.user.photoName == undefined){
            console.log('not save');
            $scope.user=defaultUser;
            //alert($scope.user.isPush);
        }
        $scope.user.id=$localstorage.get('userid') ;


        $scope.$watch('user.isPush',function(){
            //alert($scope.user.isPush);
            saveUser();
        });

        var showPhoto= function(index){
            console.log('choice is'+index);
            Camera.getPicture(index).then(function(entry) {
                //alert(entry.nativeURL);
                $scope.user.photoName = entry.nativeURL;
                saveUser();
                savePhoto($scope.user.id);

            }, function(err) {
                console.log(err);
            });

        };



        $scope.showChoice= function(){

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
                    showPhoto(index);
                    return true;
                }
            });

            // For example's sake, hide the sheet after five seconds
            $timeout(function() {
                hideSheet();
            }, 5000);

        };
        $scope.clearCache=function(){
            window.localStorage.clear();
        };
        $scope.showInput = function (type) {
            if(type == 'nickname'){
                var useTemplate='<label class="item item-input"><input type="text" ng-model="user.nickName"></label>';
                var useTitle='Enter Your Nick Name';
                var useSubTitle='like CryBoy GrennTea such thing';
            }else if(type == 'phonenumber')
            {
                var useTemplate='<label class="item item-input"><input type="text" ng-model="user.phoneNumber"></label>';
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
                                if (!$scope.user.nickName) {
                                    //don't allow the user to close unless he enters wifi password
                                    e.preventDefault();
                                } else {
                                    saveUser();
                                    return $scope.user.nickName;
                                }

                            }else if(type == 'phonenumber'){
                                if (!$scope.user.phoneNumber) {
                                    //don't allow the user to close unless he enters wifi password
                                    e.preventDefault();
                                } else {
                                    saveUser();
                                    return $scope.user.phoneNumber;
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
            $state.go('tab.keywords');
        };
    })
;