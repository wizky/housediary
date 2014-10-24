angular.module('housediary.controllers', ['openfb'])

    .controller('MenuCtrl', function ($scope, $state) {

        $scope.menus = [
            {name:'Home', state:'app.home', iconCss:'ion-home'},
            {name:'My Diary', state:'app.login', iconCss:'ion-person'}
        ]

    })

    .controller('HomeCtrl', function ($scope, $state) {

        $scope.title = "Houzz"
        $scope.content = "House Diary"

    })

    .controller('UserHomeControl', function ($scope, $location, OpenFB) {

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

    });