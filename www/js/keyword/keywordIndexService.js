angular.module('starter.service.keyword',[])
    .factory('keyWordsService', ['API_URL', '$http', '$q', '$localstorage', function (API_URL, $http, $q, $localstorage) {

        var keywords;
        var page, pages = 1;
        return {
            allKeywords: function () {
                page = 1;
                var deferred = $q.defer();
                //alert('from cache');
                var keywordsCache = $localstorage.getObject('keywordsCache1') ;
                if (!keywordsCache.nothing) {
                    //alert('from cache');
                    keywords = keywordsCache;

                    deferred.resolve(keywords);
                }
                else {
                    //alert('from http');
                    $http.get('http://172.25.206.1/jpushapi/subDetail?userId='+userId)
                        .success(function (res) {
                            console.log('在servic中的res' + JSON.stringify(res));
                            keywords = res;
                            $localstorage.setObject('keywordsCache' + page, res);

                            deferred.resolve(res);


                        })
                        .error(function (error) {
                            deferred.reject('未知原因无法完成');

                        });
                }


                return deferred.promise;
            },
            refreshKeywords: function (nextpage) {
                nextpage ? page++ : page = 1;
                //alert(page);
                var deferred = $q.defer();
                $http.get('http://172.25.206.1/jpushapi/subDetail?userId='+userId+'&page=' + page)
                    .success(function (res) {
                        console.log('在servic中的res' + JSON.stringify(res));
                        keywords = res.data;
                        $localstorage.setObject('keywordsCache' + page, res.data);

                        deferred.resolve(res.data);


                    })
                    .error(function (error) {
                        deferred.reject($localstorage.getObject('keywordsCache1'));

                    });

                return deferred.promise;

            },
            setKeywords: function (inputKeywords) {
                keywords = inputKeywords;
            },

            addKeyword: function (keyword) {

                var deferred = $q.defer();
                //alert(uri);
                $http({
                    method: 'POST',
                    url: 'http://172.25.206.1/jpushapi/subDetail',
                    params: {userId: userId, jpushId: jpushId, keyword: keyword}

                }).success(function (res) {
                    //alert(res.msg);
                    if (res.msg == 'success') {
                        var value = {
                            id:res.recordid,
                            keyid: res.id,
                            recordid:res.recordid,
                            keyword: keyword
                        };
                        keywords.unshift(value);
                        console.log('在addKeyword中的keywords' + JSON.stringify(keywords));

                        if (keywords.length>15){
                            keywords=keywords.slice(0,15);
                        }
                        $localstorage.setObject('keywordsCache1', keywords);
                        deferred.resolve(keywords);

                    } else {
                        deferred.resolve('插入失败');
                    }
                }).error(function (error) {
                    deferred.reject('未知原因无法完成');
                });
                return deferred.promise;


            },
            deleteKeyword: function (keyword) {
                alert(keyword.id);
                var deferred = $q.defer();
                //alert(uri);
                $http({
                    method: 'DELETE',
                    url: 'http://172.25.206.1/jpushapi/subDetail/' + keyword.id

                }).success(function (res) {
                    //alert(res.msg);
                    if (res.msg = 'success') {
                        //alert(keywords.length);
                        //alert(keywords.indexOf(keyword));
                        keywords.splice(keywords.indexOf(keyword), 1);
                        $localstorage.setObject('keywordsCache1', keywords);
                        deferred.resolve(res.msg);

                    } else {
                        deferred.resolve('fail');
                    }
                }).error(function (error) {
                    deferred.reject('未知原因无法完成');
                });
                return deferred.promise;

            },
            get: function (keywordId) {

                for (var i = 0; i < keywords.length; i++) {
                    if (keywords[i].keyid === parseInt(keywordId)) {
                        return keywords[i];
                    }
                }
                return null;
            }

        }
    }]);