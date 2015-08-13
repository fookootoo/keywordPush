angular.module('starter')
    .factory('jPushService', function () {
        var push;
        return {
            init: function (notificationCallback) {
                //alert('init');
                console.log('jpush: start init-----------------------');
                push = window.plugins && window.plugins.jPushPlugin;
                if (push) {
                    console.log('jpush: init');
                    window.plugins.jPushPlugin.init();
                    window.plugins.jPushPlugin.setDebugMode(true);
                    window.plugins.jPushPlugin.openNotificationInAndroidCallback = notificationCallback;
                    window.plugins.jPushPlugin.receiveNotificationIniOSCallback = notificationCallback;
                }
            }
            ,

            getId: function (onGetRegistradionID) {
                push = window.plugins && window.plugins.jPushPlugin;
                if (push) {
                    window.plugins.jPushPlugin.getRegistrationID(onGetRegistradionID);
                }
            },

            setBadge: function (badge) {
                push = window.plugins && window.plugins.jPushPlugin;
                if (push) {
                    console.log('jpush: set badge', badge);
                    window.plugins.jPushPlugin.setBadge(badge);
                }
            }
        }
    })
    .factory('AmapService', function () {
        return {
            init: function (callback) {
                var map, geolocation;
                //加载地图，调用浏览器定位服务
                map = new AMap.Map('mapContainer', {
                    resizeEnable: true
                });
                map.plugin('AMap.Geolocation', function () {
                    geolocation = new AMap.Geolocation({
                        enableHighAccuracy: true,//是否使用高精度定位，默认:true
                        timeout: 10000,          //超过10秒后停止定位，默认：无穷大
                        maximumAge: 0,           //定位结果缓存0毫秒，默认：0
                        convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
                        showButton: true,        //显示定位按钮，默认：true
                        buttonPosition: 'LB',    //定位按钮停靠位置，默认：'LB'，左下角
                        buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                        showMarker: true,        //定位成功后在定位到的位置显示点标记，默认：true
                        showCircle: true,        //定位成功后用圆圈表示定位精度范围，默认：true
                        panToLocation: true,     //定位成功后将定位到的位置作为地图中心点，默认：true
                        zoomToAccuracy: true      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                    });
                    map.addControl(geolocation);
                    AMap.event.addListener(geolocation, 'complete', callback);
                });//返回定位信息
                geolocation.getCurrentPosition();
            }
        }
    })
    .factory('Camera', ['$q', function($q) {

        return {
            getPicture: function(index) {
                //alert('camera');
                var options={};
                if(index == 0){
                    options={
                        quality: 75,
                        targetWidth: 320,
                        targetHeight: 320,
                        saveToPhotoAlbum: false
                    };
                }else if(index == 1){
                    options={
                        quality: 75,
                        targetWidth: 320,
                        targetHeight: 320,
                        destinationType: navigator.camera.DestinationType.FILE_URI,
                        sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
                    };
                }
                var q = $q.defer();

                navigator.camera.getPicture(function(result) {
                    // Do any magic you need
                    onImageSuccess(result);

                    function onImageSuccess(fileURI) {
                        createFileEntry(fileURI);
                    }

                    function createFileEntry(fileURI) {
                        window.resolveLocalFileSystemURL(fileURI, copyFile, fail);
                    }

                    // 5
                    function copyFile(fileEntry) {
                        var name = fileEntry.fullPath.substr(fileEntry.fullPath.lastIndexOf('/') + 1);
                        var newName = makeid() + name;

                        window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(fileSystem2) {
                                fileEntry.copyTo(
                                    fileSystem2,
                                    newName,
                                    onCopySuccess,
                                    fail
                                );
                            },
                            fail);
                    }

                    // 6
                    function onCopySuccess(entry) {
                        q.resolve(entry);
                    }

                    function fail(error) {

                        console.log("fail: " + error.code);
                        q.reject(error);
                    }

                    function makeid() {
                        var text = "";
                        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

                        for (var i=0; i < 5; i++) {
                            text += possible.charAt(Math.floor(Math.random() * possible.length));
                        }
                        return text;
                    }

                }, function(err) {
                    q.reject(err);
                }, options);

                return q.promise;
            }
        }
    }])
    .factory('$localstorage', ['$window', function ($window) {
        return {
            set: function (key, value) {
                $window.localStorage[key] = value;
            },
            get: function (key, defaultValue) {
                return $window.localStorage[key] || defaultValue;
            },
            setObject: function (key, value) {
                $window.localStorage[key] = JSON.stringify(value);
            },
            getObject: function (key) {
                return JSON.parse($window.localStorage[key] || '{"nothing":"true"}');
            }
        }
    }])
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
                            keywords = res.data;
                            $localstorage.setObject('keywordsCache' + page, res.data);

                            deferred.resolve(res.data);


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
                    if (res.msg = 'success') {
                        var value = {
                            id: res.id,
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
                //alert(keyword.id);
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
                        //$localstorage.setObject('keywordsCache', keywords);
                        deferred.resolve(res.msg);

                    } else {
                        deferred.resolve('删除失败');
                    }
                }).error(function (error) {
                    deferred.reject('未知原因无法完成');
                });
                return deferred.promise;

            },
            get: function (keywordId) {
                //alert(keywordId);
                for (var i = 0; i < keywords.length; i++) {
                    if (keywords[i].id === parseInt(keywordId)) {
                        return keywords[i];
                    }
                }
                return null;
            }

        }
    }])
    .factory('userService', ['$http','$q', function ($http,$q ) {
        var userInfo={};
        return {
            firstReg:function(){
                var deferred = $q.defer();
                userInfo={
                    deviceId:deviceId,
                    jpushId:jpushId
                };
                $http({
                    method: 'POST',
                    url: 'http://172.25.206.1/jpushapi/firstReg',
                    params: userInfo

                }).success(function (res) {
                    //alert("doPost返回结果了"+res);
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
                    alert('firstReg net work wrong');
                });
                return deferred.promise;
            },

            getUserInfo:function(userid){
                var deferred=$q.defer();
                $http({
                    method: 'GET',
                    url: 'http://172.25.206.1/jpushapi/SlUser/'+userid


                }).success(function (res) {
                    //alert("doPost返回结果了"+res);
                    if(res.id == userid){
                        deferred.resolve(res);
                        console.log('get info succ');
                    }
                    else{
                        deferred.reject('fail');
                        console.log('first reg fail');
                    }
                }).error(function (error) {
                    deferred.reject('fail');
                    alert('getUserInfo net work wrong');
                });
                return deferred.promise;



            },
            saveUser:function(userInfo,id){

                //alert(userInfo.isPush);
                var deferred = $q.defer();


                $http({
                    method: 'PUT',
                    url: 'http://172.25.206.1/jpushapi/SlUser/'+id,
                    params: userInfo

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
                    alert('saveUser net work wrong');
                });
                return deferred.promise;

            }
        }

    }])
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
                    alert('getUserInfo net work wrong');
                });
                return deferred.promise;


            }
        }

    }])
;