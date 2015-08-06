angular.module('starter')
    .controller('KeywordsCtrl', function ($scope, $q, jPushService,keyWordsService) {
        var useCache=true;

        $scope.moreDataCanBeLoaded=true;
        var nextpage=true;

        keyWordsService.allKeywords(useCache).then(function(res){
            //alert(res);

            console.log(JSON.stringify(res));
            $scope.keywords =res;
            //alert(res.length);
            if(res.length<15){
                $scope.moreDataCanBeLoaded=false;
            }
            else {
                $scope.moreDataCanBeLoaded = true;
            }
            keyWordsService.setKeywords(res);
        },function(err){
            alert(err);
        });

        $scope.loadMoreData=function(){

            //alert('loadmore');
            nextpage=true;
            keyWordsService.refreshKeywords(nextpage).then(function(res){
                //alert(res);
                console.log('在controller中doRefresh的res'+JSON.stringify(res));


                $scope.keywords=$scope.keywords.concat(res);
                keyWordsService.setKeywords($scope.keywords);
                $scope.$broadcast('scroll.infiniteScrollComplete');
                if(res.length<15){
                    $scope.moreDataCanBeLoaded=false;
                }else{
                    $scope.moreDataCanBeLoaded=true;
                }
            },function(err){
                alert('网络问题');
                $scope.$broadcast('scroll.refreshComplete');

            });

        };

        $scope.doRefresh=function(){
            //alert('here');
            $scope.keywords='';
            nextpage=false;
            keyWordsService.refreshKeywords(nextpage).then(function(res){
                //alert(res);
                console.log('在controller中doRefresh的res'+JSON.stringify(res));

/*                items=[{"id":51,"userId":"hahaha","jpushId":"","keyword":"阿的萨达","created_at":"2015-08-04 01:59:20","updated_at":"2015-08-04 01:59:20"}];
                $scope.keywords = items.concat($scope.keywords);*/
                $scope.keywords=res;

                if(res.length<15){
                    $scope.moreDataCanBeLoaded=false;
                }else{
                    $scope.moreDataCanBeLoaded=true;
                }

                keyWordsService.setKeywords(res);

                //keyWordsService.setKeywords(res);
                $scope.$broadcast('scroll.refreshComplete');
            },function(err){
                alert('网络问题');
                $scope.keywords=err;
                $scope.$broadcast('scroll.refreshComplete');
            });

        };
        $scope.addKeyword=function(keyword){

            keyWordsService.addKeyword(keyword).then(function(res){
                //alert(res);
                console.log(JSON.stringify(res));
                $scope.keywords =res;

            },function(err){
                alert(err);
            });

        };
        $scope.remove=function(keyword){
            //alert(keyword);

            keyWordsService.deleteKeyword(keyword).then(function(res){
                //alert(res);

                //$scope.doRefresh();
                console.log(JSON.stringify(res));

            },function(err){
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
    .controller('KeywordsDetailCtrl', function ($scope,keyWordsService,$stateParams) {
        $scope.keyvalue=keyWordsService.get($stateParams.keywordId)

    })
    .controller('SettingCtrl', function ($scope) {

    })
    .controller('FindCtrl', function ($scope, $state, $ionicSlideBoxDelegate,AmapService) {


        var locationCallback=function(data){
            console.log(data.position.getLng()+'  '+data.position.getLat());
        };
        AmapService.init(locationCallback);





        $scope.navSlide = function(index) {
            $ionicSlideBoxDelegate.slide(index, 500);
        };

    })
    .controller('SplashCtrl',function($scope, $state, $ionicSlideBoxDelegate,$localstorage){

        var firstrun = $localstorage.get('firstRun') || 'nothing';
        //alert(firstrun);
        if(firstrun =='no first' ){
            $state.go('tab.keywords');

        }else{
            $localstorage.set('firstRun','no first');
        }

        $scope.navSlide = function(index) {
            //alert(index);
            $ionicSlideBoxDelegate.slide(index, 500);
        };
        $scope.slideChanged =function(index) {

            $scope.slideIndex = index;
        };
        $scope.onSwipeLeft=function(){
            $state.go('tab.keywords');
        };
    })
;