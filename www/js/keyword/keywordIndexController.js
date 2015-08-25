angular.module('starter.controller.keyword',[])
    .controller('KeywordsCtrl', function ($scope, $q, jPushService, keyWordsService,$timeout,$interval,$state) {
        var useCache = true;


        $scope.moreDataCanBeLoaded = true;
        var nextpage = true;

        function updateTags(res){
            $scope.tags.length=0;
            res.forEach(
                function(element, index, array){
                    console.log(index);
                    var eachone={ id:element.keyid,recordid:element.id,text: element.keyword,  value: Math.random()*(20-10)+30 };
                    $scope.tags.push(eachone);

                    console.log(index +'  '+element.id);
                });
        }

        keyWordsService.allKeywords(useCache).then(function (res) {
            //alert(res);

            console.log(JSON.stringify(res));

            $scope.keywords = res;
            updateTags(res);
            console.log($scope.tags);
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
                updateTags(res);

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
                if(res == 'success'){
                    $state.go('tab.keywords');
                }

            }, function (err) {
                alert(err);
            });
        };


        $scope.getId = function () {


            jPushService.getId(function (data) {
                $scope.registerId = data;
                $scope.$apply();

            });
        };








        $scope.tags = [{text: 'Loading...', value: 40}, {text: 'Please'}, {text: 'wait'}, {text: 'a'}, {text: 'few'}, {text: 'seconds'}];

    }
);