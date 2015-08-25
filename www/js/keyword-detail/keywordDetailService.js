angular.module('starter.service.keywordDetail',[])
    .factory('ResultService',['$http','$q',function($http,$q){
        var results={};

        return{
            getResults:function(keyword){
                var deferred=$q.defer();
                //alert('http://172.25.206.1/jpushapi/SlResult?keyword='+keyword);
                $http({
                    method: 'GET',
                    url: 'http://172.25.206.1/jpushapi/SlResult?keyword='+keyword
                }).success(function (res) {
                    //alert("doPost返回结果了"+res);

                    deferred.resolve(res);
                    results=res;


                }).error(function (error) {
                    deferred.reject('fail');
                    alert('Keywords Result get net work wrong');
                });
                return deferred.promise;


            }
        }

    }])
    .factory('CommentService',['$http','$q',function($http,$q){
        var comments={};

        return{
            getComments:function(keyword){
                var deferred=$q.defer();
                //alert('http://172.25.206.1/jpushapi/SlComment?keyword='+keyword);
                $http({
                    method: 'GET',
                    url: 'http://172.25.206.1/jpushapi/SlComment?keyword='+keyword
                }).success(function (res) {
                    //alert("getComments"+res.current_page);

                    deferred.resolve(res);
                    comments=res;


                }).error(function (error) {
                    deferred.reject('fail');
                    alert('getComments net work wrong');
                });
                return deferred.promise;


            },
            saveComments:function(keywordId,userId,comment){
                var deferred = $q.defer();

                var data={
                    keywordId:keywordId,
                    userId:userId,
                    comment:comment
                };


                $http({
                    method: 'Post',
                    url: 'http://172.25.206.1/jpushapi/SlComment',
                    params: data

                }).success(function (res) {
                    //alert("doPost返回结果了"+res);
                    //alert(res.msg);
                    if(res.msg=='success'){
                        deferred.resolve(res.id);
                        console.log('first reg succ');

                    }
                    else{
                        deferred.reject('fail');
                        console.log('first reg fail');
                    }
                }).error(function (error) {
                    deferred.reject('fail');
                    alert('saveComment net work wrong');
                });
                return deferred.promise;

            }
        }

    }])
;