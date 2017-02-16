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
function HomeController($scope, $window, $q, $http, Shops, $rootScope, ActiveShopListings, ListingThumbnails, ListingTransactions) {
    $scope.isLoggedIn = false;
    $scope.thumbnails = {};
    $scope.transactions = {};
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
    var shop = Shops.get({}, function(data) {
		$scope.shop = data;
        console.log($scope.shop);
        shop_id = $scope.shop.results[0].shop_id;

        var shop_listings = ActiveShopListings.get({ shop_id: shop_id }, function(listings) {
            var i = 0;
            var j = 0;
            console.log(listings.results);
            for (var listing of listings.results) {
                var listing_thumb = ListingThumbnails.get({ listing_id: listing.listing_id }, function(img) {
                    console.log(listing.listing_id);
                    console.log(i);
                    $scope.thumbnails[i] = img.results;
                    i++;
            	});

            }


            for (var listing of listings.results) {
                var transactions_req = ListingTransactions.get({ shop_id: shop_id }, function(transactions) {
                    console.log(transactions);
                    if (!$scope.transactions[j]) {
                        $scope.transactions[j] = transactions;
                        j++;
                    }
            	});

            }

           $scope.shop_listings = listings;
           console.log($scope.shop_listings);
           console.log($scope.thumbnails);
           console.log($scope.transactions);
    	});
	});

    $scope.get_listing_thumbnail = function(id) {
        return ($scope.thumbnails[id]);
    };

	$scope.logout = function () {
        $rootScope.isLoggedIn = false;
        $scope.isLoggedIn = false;
		$window.location.href= '/login';
	}
}
