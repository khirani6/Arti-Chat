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
	$scope.tab = 3;

    $scope.setTab = function(newTab){
      $scope.tab = newTab;
    };

    $scope.isSet = function(tabNum){
      return $scope.tab === tabNum;
    };
   	var user_data = user_data_global.replace(new RegExp("&#34;", 'g'), "\"");
	$scope.user_data = JSON.parse(user_data);
}

