angular.module('starter.service',[])
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
                        sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY,
                        correctOrientation: true
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
    ;