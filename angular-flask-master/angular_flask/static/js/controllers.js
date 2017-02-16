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

function LoginController($scope, $window, $rootScope) {
    $scope.isLoading = false;
    $rootScope.isLoggedIn = false;
	$scope.loginButtonPress = function () {
        $scope.isLoading = true;
        $rootScope.isLoggedIn = true;
		$window.location.href='/login2';
	}
}
function HomeController($scope, $window, Shops, $rootScope, ActiveShopListings) {
    $scope.isLoggedIn = false;
	$scope.tab = 1;
    $scope.setTab = function(newTab) {
      $scope.tab = newTab;
    };

    $scope.isSet = function(tabNum) {
      return $scope.tab === tabNum;
    };

   	var user_data = user_data_global.replace(new RegExp("&#34;", 'g'), "\"");
	$scope.user_data = JSON.parse(user_data);
    console.log($scope.user_data)

    $scope.isLoggedIn = ($scope.user_data != null) //temp way of handling this
    var shop_id = null;
    var listings = Shops.get({}, function(data) {
		$scope.listings = data;
        console.log($scope.listings);
        shop_id = $scope.listings.results[0].shop_id;

        var shop_listings = ActiveShopListings.get({ shop_id: shop_id }, function(data) {
    		$scope.shop_listings = data;
            console.log($scope.shop_listings);
    	});
	});





	$scope.logout = function () {
        $rootScope.isLoggedIn = false;
        $scope.isLoggedIn = false;
		$window.location.href= '/login';
	}
}
