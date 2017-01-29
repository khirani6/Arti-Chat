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

function LoginController($scope, $window) {
	$scope.loginButtonPress = function () {
		$window.location.href='/login2';
	}
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

