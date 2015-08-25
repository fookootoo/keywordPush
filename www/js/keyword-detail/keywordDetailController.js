angular.module('starter.controller.keywordDetail',[])
.controller('KeywordsDetailCtrl', function ($scope, keyWordsService, $stateParams, ResultService, $ionicModal,CommentService,$ionicPopover,$state) {
    $scope.keyvalue = keyWordsService.get($stateParams.keywordId);

    $ionicPopover.fromTemplateUrl('js/keyword-detail/keywords-detail-popover.html', {
        scope: $scope
    }).then(function(popover) {
        $scope.popover = popover;
        animation: 'slide-in-down'
    });
    $scope.delete=function(){
        keyWordsService.deleteKeyword($scope.keyvalue).then(function (res) {
            //alert(res);

            //$scope.doRefresh();
            console.log(JSON.stringify(res));
            if(res == 'success'){
                $state.go('tab.keywords');
            }

        }, function (err) {
            alert(err);
        });
    }

    //alert($scope.keyvalue.keyword);

    $ionicModal.fromTemplateUrl('js/keyword-detail/keywords-detail-createComment.html', function(modal) {
        $scope.modal = modal;
    }, {
        scope : $scope,
        animation: 'slide-in-up'

    });

    ResultService.getResults($scope.keyvalue.keyword).then(
        function (res) {
            if(res.data.length ==0){
                $scope.resultText='no';
            }else{
                $scope.resultText='yes';
            }
            console.log(res.data);
            $scope.results = res.data;
        },
        function (error) {
            alert('net work wrong');
        }
    );
    refreshComments();
    function refreshComments(){
        CommentService.getComments($scope.keyvalue.keyword).then(
            function (res) {
                console.log('刷新评论'+res.data);
                $scope.comments = res.data;
            },
            function (error) {
                alert('net work wrong');
            }
        );

    }



    $scope.createComment=function(detail) {
        //alert(detail.newComment);
        CommentService.saveComments($scope.keyvalue.keyid,userId,detail.newComment).then(
            function (res){
                //alert(res);
                refreshComments();

            },
            function(error){
                alert(error);
            }

        );

    };

    $scope.openUrl = function (url) {
        alert(url);
        var ref = window.open(url, '_blank', 'location=yes');
    }

});