angular.module('housediary.controllers', ['openfb'])
    .run(function($http) {
        $http.defaults.headers.common.Authorization = 'Basic YmVlcDpib29w';
        //$http.defaults.headers.get.NewHeader = 'afsf';
    })
    .config(function($httpProvider){
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    })

    .controller('MenuCtrl', function ($scope, $state) {
        $scope.menus = [
            {name:'Home', state:'app.home', iconCss:'ion-home'},
            {name:'Wechat', state:'app.wechat', iconCss:'ion-person'},
            {name:'My Diary', state:'app.login', iconCss:'ion-person'}
        ]
    })

    .controller('HomeCtrl', function ($scope, $state) {
        $scope.title = "House Diary";
        $scope.content = "House Diary"
    })

    .controller('UserHomeControl', function ($scope, $location, OpenFB, $filter, $q, $http) {

        $scope.facebookLogin = function () {

            OpenFB.login('email,read_stream,publish_stream,read_friendlists,user_friends').then(
                function () {
                    OpenFB.get('/me/?fields=id,email').success(function (user) {
                        $scope.user = user;
                        $scope.findFriends();
                        console.log(JSON.stringify(user))
                    });
//                    $location.path('/app/person/me/feed');
                },
                function () {
                    alert('OpenFB login failed');
                });

        };

        $scope.findFriends = function () {
            OpenFB.get('/' + $scope.user.id + '/friends', {limit: 50})
                .success(function (result) {
                    $scope.friends = result.data;
                })
                .error(function(data) {
                    alert(data.error.message);
                });
        };

        $scope.yammerLogin = function () {
            yam.login({loginType: "session"}, function(response)
            {
                alert(response);
            });
        };

        $scope.yammerGetLoginStatus = function() {

            yam.getLoginStatus(
                function(response) {
                    if (response.authResponse) {

                        $scope.yammerUser = response.user;
//                        $scope.yammerResults = response.authResponse;
                        console.log("logged in");
                        $scope.yammerGetRelations();
//                        yam.platform.request({
//                            url: "users/current.json",     //this is one of many REST endpoints that are available
//                            method: "GET",
//                            data: {    //use the data object literal to specify parameters, as documented in the REST API section of this developer site
////                                "letter": "a",
////                                "page": "2",
//                            },
//                            success: function (user) { //print message response information to the console
////                                alert("The request was successful.");
//                                $scope.yammerUser = response;
//                                console.dir(user);
//                            },
//                            error: function (user) {
//                                alert("There was an error with the request.");
//                            }
//                        });
                    }
                    else {
                        $scope.yammerUser = "hello1";
                        $scope.yammerLogin(
                            function()
                            {
                                $scope.yammerUser = "hello1";
                                $scope.yammerGetLoginStatus();
                            }
                        );
//                        alert("not logged in")
                    }
                }
            );
        };

        $scope.yammerGetRelations = function() {

            yam.platform.request({
                url: "subscriptions",     //this is one of many REST endpoints that are available
                method: "GET",
                data: {    //use the data object literal to specify parameters, as documented in the REST API section of this developer site
                    "target_type": "user",
//                                "page": "2",
                },
                success: function (user) { //print message response information to the console
                    console.dir(user);
                    //$scope.yammerFriends = user.subscriptions;
                    var friends  = $filter('filter')(user.subscriptions, {target_type: 'user'});

                    var tmp = [];
                    angular.forEach(friends, function(response) {
                        tmp.push(response.target_id);
                    });

                    $scope.getAllYammerFriendProfiles(tmp)
                        .then(
                        function(data) {
                            $scope.yammerFriends = data;
                        },
                        function(error) {
                            console.log(error);
                        },
                        function(update) {
                            console.log(update);
                        });

                    $scope.$apply();
                },
                error: function (user) {
                    alert("There was an error with the request.");
                }
            });

        };

        $scope.getAllYammerFriendProfiles = function(urls)
        {
            var deferred = $q.defer();

            var urlCalls = [];
            angular.forEach(urls, function(url) {
                urlCalls.push(
                    yam.platform.request({
                        //url: "users"+url+".json",     //this is one of many REST endpoints that are available
                        url: "users/" + url + ".json",
                        method: "GET"
//                        data: {    //use the data object literal to specify parameters, as documented in the REST API section of this developer site
//                            "target_type": "user",
////                                "page": "2",
//                        },
                    }).xhr)
            });

            // they may, in fact, all be done, but this
            // executes the callbacks in then, once they are
            // completely finished.
            $q.all(urlCalls)
                .then(
                function(results) {
                    deferred.resolve(results)
                },
                function(errors) {
                    deferred.reject(errors);
                },
                function(updates) {
                    deferred.update(updates);
                });
            return deferred.promise;
        };

    })

    .controller('ShareCtrl', function ($scope, OpenFB) {

        $scope.item = {};

        $scope.share = function () {
            OpenFB.post('/me/feed', $scope.item)
                .success(function () {
                    $scope.status = "This item has been shared on OpenFB";
                })
                .error(function(data) {
                    alert(data.error.message);
                });
        };

    })

    .controller('ProfileCtrl', function ($scope, OpenFB) {
        OpenFB.get('/me').success(function (user) {
            $scope.user = user;
        });
    })

    .controller('PersonCtrl', function ($scope, $stateParams, OpenFB) {
        OpenFB.get('/' + $stateParams.personId).success(function (user) {
            $scope.user = user;
        });
    })

    .controller('FriendsCtrl', function ($scope, $stateParams, OpenFB) {
        OpenFB.get('/' + $stateParams.personId + '/friends', {limit: 50})
            .success(function (result) {
                $scope.friends = result.data;
            })
            .error(function(data) {
                alert(data.error.message);
            });
    })

    .controller('MutualFriendsCtrl', function ($scope, $stateParams, OpenFB) {
        OpenFB.get('/' + $stateParams.personId + '/mutualfriends', {limit: 50})
            .success(function (result) {
                $scope.friends = result.data;
            })
            .error(function(data) {
                alert(data.error.message);
            });
    })

    .controller('FeedCtrl', function ($scope, $stateParams, OpenFB, $ionicLoading) {

        $scope.show = function() {
            $scope.loading = $ionicLoading.show({
                content: 'Loading feed...'
            });
        };
        $scope.hide = function(){
            $scope.loading.hide();
        };

        function loadFeed() {
            $scope.show();
            OpenFB.get('/' + $stateParams.personId + '/home', {limit: 30})
                .success(function (result) {
                    $scope.hide();
                    $scope.items = result.data;
                    // Used with pull-to-refresh
                    $scope.$broadcast('scroll.refreshComplete');
                })
                .error(function(data) {
                    $scope.hide();
                    alert(data.error.message);
                });
        }

        $scope.doRefresh = loadFeed;

        loadFeed();

    })

    .controller('DemoCtrl', function ($scope, $ionicPopup, $http) {

        $scope.data = {
            selectedScene: 0,
            selectedSceneLabel: "会话"
        };

        $scope.data.authData =
        {
            codeResponse: {
                "state": "wechat_sdk_demo_test",
                "lang": "zh_CN",
                "country": "us",
                "code": "021682a365d737ba3259b088799d23bc"
            },
            accessTokenResponse: {
                access_token: "OezXcEiiBSKSxW0eoylIeAyKHFvAxKfpbnek2nlCY2R0BbgIZAbEXaumA01wB7vDBCi8NUmkc2144AEmkojjgzXCYZtnttXR52FwJeAbtuitDgY8avcv036HeeehZsxrhfMbkDB8PyG8rR1QY30ASQ",
                expires_in: 7200,
                openid: "or297s-AE3vWu4AUUd-_wUbbP6Z8",
                refresh_token: "OezXcEiiBSKSxW0eoylIeAyKHFvAxKfpbnek2nlCY2R0BbgIZAbEXaumA01wB7vDwKlhIEW1HBh58BkeUKJX0J5Ip5sT_QydqDd6LI4ByYeAQlgFeSge33i-oEO1RB3vahH9pTens6pjq-UGJuXrCg",
                scope: "snsapi_userinfo"
            }
        }

        $scope.scenes = [
            {
                label: "会话",
                value: 0
            },
            {
                label: "朋友圈",
                value: 1
            },
            {
                label: "收藏",
                value: 2
            }
        ];

        $scope.buttons = [
            {
                id: "check-installed",
                label: "是否安装了微信"
            },
            {
                id: "send-text",
                label: "发送Text消息给微信"
            },
            {
                id: "send-photo",
                label: "发送Photo消息给微信"
            },
            {
                id: "send-link",
                label: "发送Link消息给微信"
            },
            {
                id: "send-music",
                label: "发送Music消息给微信"
            },
            {
                id: "send-video",
                label: "发送Video消息给微信"
            },
            {
                id: "send-app",
                label: "发送App消息给微信"
            },
            {
                id: "send-nongif",
                label: "发送非gif消息给微信"
            },
            {
                id: "send-gif",
                label: "发送gif消息给微信"
            },
            {
                id: "send-file",
                label: "发送文件消息给微信"
            },
            {
                id: "auth",
                label: "微信授权登录"
            },
            {
                id: "test-url",
                label: "测试URL长度"
            },
            {
                id: "open-profile",
                label: "打开Profile"
            },

            {
                id: "open-mp",
                label: "打开mp网页"
            },
            {
                id: "add-card",
                label: "添加单张卡券至卡包"
            },
            {
                id: "add-cards",
                label: "添加多张卡券至卡包"
            }
        ];

        $scope.$watch('data.selectedScene', function () {
            $scope.scenes.forEach(function (item) {
                if (item.value == $scope.data.selectedScene) {
                    $scope.data.selectedSceneLabel = item.label;
                }
            });
        }, true);

        $scope.handle = function (id) {
            var params = {
                scene: $scope.data.selectedScene
            };



            if (id == 'send-text') {
                params.text = "人文的东西并不是体现在你看得到的方面，它更多的体现在你看不到的那些方面，它会影响每一个功能，这才是最本质的。但是，对这点可能很多人没有思考过，以为人文的东西就是我们搞一个很小清新的图片什么的。”综合来看，人文的东西其实是贯穿整个产品的脉络，或者说是它的灵魂所在。";
            } else {
                params.message = {
                    title: "[TEST]" + id,
                    description: "[TEST]Sending from test application",
                    thumb: "www/resources/res1thumb.png",
                    mediaTagName: "TEST-TAG-001",
                    messageExt: "这是第三方带的测试字段",
                    messageAction: "<action>dotalist</action>",
                    media: {}
                };

                switch (id) {
                    case 'check-installed':
                        Wechat.isInstalled(function (installed) {
                            alert("Wechat installed: " + (installed ? "Yes" : "No"));
                        });
                        return ;

                    case 'send-photo':
                        params.message.thumb = "www/resources/res1thumb.png";
                        params.message.media.type = Wechat.Type.IMAGE;
                        params.message.media.image = "www/resources/res1.jpg";
                        break;

                    case 'send-link':
                        params.message.thumb = "www/resources/res2.png";
                        params.message.media.type = Wechat.Type.LINK;
                        params.message.media.webpageUrl = "http://tech.qq.com/zt2012/tmtdecode/252.htm";
                        break;

                    case 'send-music':
                        params.message.thumb = "www/resources/res3.jpg";
                        params.message.media.type = Wechat.Type.MUSIC;
                        params.message.media.musicUrl = "http://y.qq.com/i/song.html#p=7B22736F6E675F4E616D65223A22E4B880E697A0E68980E69C89222C22736F6E675F5761704C69766555524C223A22687474703A2F2F74736D7573696334382E74632E71712E636F6D2F586B30305156342F4141414130414141414E5430577532394D7A59344D7A63774D4C6735586A4C517747335A50676F47443864704151526643473444442F4E653765776B617A733D2F31303130333334372E6D34613F7569643D3233343734363930373526616D703B63743D3026616D703B636869643D30222C22736F6E675F5769666955524C223A22687474703A2F2F73747265616D31342E71716D757369632E71712E636F6D2F33303130333334372E6D7033222C226E657454797065223A2277696669222C22736F6E675F416C62756D223A22E4B880E697A0E68980E69C89222C22736F6E675F4944223A3130333334372C22736F6E675F54797065223A312C22736F6E675F53696E676572223A22E5B494E581A5222C22736F6E675F576170446F776E4C6F616455524C223A22687474703A2F2F74736D757369633132382E74632E71712E636F6D2F586C464E4D313574414141416A41414141477A4C36445039536A457A525467304E7A38774E446E752B6473483833344843756B5041576B6D48316C4A434E626F4D34394E4E7A754450444A647A7A45304F513D3D2F33303130333334372E6D70333F7569643D3233343734363930373526616D703B63743D3026616D703B636869643D3026616D703B73747265616D5F706F733D35227D";
                        params.message.media.musicDataUrl = "http://stream20.qqmusic.qq.com/32464723.mp3";
                        break;

                    case 'send-video':
                        params.message.thumb = "www/resources/res7.jpg";
                        params.message.media.type = Wechat.Type.VIDEO;
                        params.message.media.videoUrl = "http://v.youku.com/v_show/id_XNTUxNDY1NDY4.html";
                        break;

                    case 'send-app':
                        params.message.thumb = "www/resources/res2.jpg";
                        params.message.media.type = Wechat.Type.APP;
                        params.message.media.extInfo = "<xml>extend info</xml>";
                        params.message.media.url = "http://weixin.qq.com";
                        break;

                    case 'send-nongif':
                        params.message.thumb = "www/resources/res5thumb.png";
                        params.message.media.type = Wechat.Type.EMOTION;
                        params.message.media.emotion = "www/resources/res5.jpg";
                        break;

                    case 'send-gif':
                        params.message.thumb = "www/resources/res6thumb.png";
                        params.message.media.type = Wechat.Type.EMOTION;
                        params.message.media.emotion = "www/resources/res6.gif";
                        break;

                    case 'send-file':
                        params.message.thumb = "www/resources/res2.jpg";
                        params.message.media.type = Wechat.Type.FILE;
                        params.message.media.file = "www/resources/iphone4.pdf";
                        break;

                    case 'auth':
                        Wechat.auth("snsapi_userinfo", function (response) {
                                // you may use response.code to get the access token.
                                $scope.data.authData.codeResponse = response;
                                console.log(JSON.stringify(response));
                                $http.post(
                                    "https://api.weixin.qq.com/sns/oauth2/access_token?appid=wx6bac5262a02e91c4&secret=d4425169eee6926efd8cd0c89376ff38&code="
                                    + response.code + "&grant_type=authorization_code").
                                    success(function (data, status, headers, config) {
                                        console.log(data);
                                        $scope.data.authData.accessTokenResponse = data;
                                    }).
                                    error(function (data, status, headers, config) {
                                        // called asynchronously if an error occurs
                                        // or server returns response with an error status.
                                    });
                        }, function (reason) {
                            console.log("Failed: " + JSON.stringify(reason));
                        });
                        break;
                    case 'open-profile':
                        $http.post(
                            "https://api.weixin.qq.com/sns/userinfo?access_token=" + $scope.data.authData.accessTokenResponse.access_token
                            + "&openid=" + $scope.data.authData.accessTokenResponse.openid).
                            success(function (data, status, headers, config) {
                                console.log(data);
                                $scope.data.profile = data;
                            }).
                            error(function (data, status, headers, config) {
                                // called asynchronously if an error occurs
                                // or server returns response with an error status.
                            });
                        return;
                    default:
                        $ionicPopup.alert({
                            title: 'Not supported!',
                            template: 'Keep patient, young man.'
                        });

                        return ;
                }
            }

            Wechat.share(params, function () {
                alert("Success");
            }, function (reason) {
                alert("Failed: " + reason);
            });
        };
    })