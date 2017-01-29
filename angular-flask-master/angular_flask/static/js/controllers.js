'use strict';

/* Controllers */

function IndexController($scope) {

}

function AboutController($scope) {

}

function PostListController($scope, Post) {
	var postsQuery = Post.get({}, function(posts) {
		$scope.posts = posts.objects;
	});
}

function PostDetailController($scope, $routeParams, Post) {
	var postQuery = Post.get({ postId: $routeParams.postId }, function(post) {
		$scope.post = post;
	});
}

function LoginController($scope, $window, $http, loginFactory, testingFactory) {
    $scope.isLoggedIn = false;
    $scope.data = {};
    $scope.isLoading = false;


    $scope.toggleView = function(e) {
    //    $scope.isLoggedIn = !$scope.isLoggedIn;
        $scope.isLoading = !$scope.isLoading;
        $http.get("https://openapi.etsy.com/v2/users/etsystore?api_key=fvfa290fd1oj7mz3q9sz8de3").then(function (response) {
            $scope.data = response.data;
        });
    };

	$scope.loginButtonPress = function () {
        console.log("wut");
        $scope.isLoading = true;
        $window.location.href='/login2';
        /*
        var ret = loginFactory.get({}, function(data) {
            $scope.data = data;
        })*/

	};
}
function HomeController($scope, $window) {
	$scope.tab = 1;

    $scope.setTab = function(newTab){
      $scope.tab = newTab;
    };

    $scope.isSet = function(tabNum){
      return $scope.tab === tabNum;
    };
    $scope.user_data = user_data_global;
}
