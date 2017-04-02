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

function HomeController($scope, $window, $q, $http, Shops, $rootScope, ActiveShopListings, ListingThumbnails, ListingTransactions, UserProfileFactory, UserFactory, ReceiptFactory, Lightbox, facebookService) {
    $scope.isLoggedIn = false;
    $scope.finished_loading = false;
    $scope.viewing_lightbox = false;

    $scope.thumbnails = {};
    $scope.transactions = {}; //lookup by listing id
    $scope.buyers = {}; //lookup by buyer profile id
    $scope.receipts = {}; //index by receipt ID
    $scope.emails = {};

	$scope.tab = 1;
    $scope.setTab = function(newTab) {
      $scope.tab = newTab;
      console.log($scope.transactions);
    };

    $scope.isSet = function(tabNum) {
      return ($scope.tab === tabNum);
    };

   	var user_data = user_data_global.replace(new RegExp("&#34;", "g"), "\"");
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
            for (let listing of listings.results) {
                var temp_id = listing.listing_id;
                console.log(temp_id);
                var listing_thumb = ListingThumbnails.get({ listing_id: temp_id }, function(img) {
                    console.log(listing.listing_id);
                    console.log(i);
                    $scope.thumbnails[listing.listing_id] = img.results;
                    i++;
            	});
            }

            var transactions_req = ListingTransactions.get({ shop_id: shop_id }, function(transactions) {
                for (var transaction of transactions.results) {
                    $scope.transactions[transaction.listing_id] = [];
                }

                for (var transaction of transactions.results) {
                    console.log(transaction);
                    $scope.transactions[transaction.listing_id].push(transaction);
                    let user_id = transaction.buyer_user_id;
                    var user_profile = UserFactory.get({ user_id: user_id }, function(data) {
                        $scope.buyers[user_id] = data.results;
                        $scope.finished_loading = true;
                    });

                    let receipt_id = transaction.receipt_id;
                    var receipt = ReceiptFactory.get({ receipt_id: receipt_id} , function(data) {
                        $scope.receipts[receipt_id] = data.results;
                        if ($scope.receipts[receipt_id]) {
                            $scope.emails[transaction.buyer_user_id] = $scope.receipts[receipt_id][0].buyer_email;
                        }
                    });
                }
        	});
            $scope.shop_listings = listings;
    	});
	});

    $scope.get_listing_thumbnail = function(id) {
        return ($scope.thumbnails[id]);
    };

    $scope.get_buyer_email = function(transaction) {
        if (transaction && $scope.receipts[transaction.receipt_id]) {
            return ("mailto:" + $scope.receipts[transaction.receipt_id][0].buyer_email);
        }

    }

	$scope.logout = function () {
        $rootScope.isLoggedIn = false;
        $scope.isLoggedIn = false;
		$window.location.href= '/login';
	};

    $scope.epoch_seconds_to_local_time = function(str) {
        var temp = parseInt(str);
        var d = new Date(temp * 1000);
        return (d.toLocaleDateString() + " @ " + d.toLocaleTimeString());
    }

    $scope.expand_order_details = function (transaction) {
        var listing_id = transaction.listing_id;
        console.log(transaction);
        var image_url = $scope.thumbnails[listing_id][0].url_170x135;
        var thumb_url = $scope.thumbnails[listing_id][0].url_75x75;

        Lightbox["buyer_name"] = $scope.buyers[transaction.buyer_user_id][0].login_name;
        Lightbox["price"] = transaction.price;
        Lightbox["receipt_id"] = transaction.receipt_id;

        var receipt = $scope.receipts[transaction.receipt_id];
        console.log(receipt);
        Lightbox["shipped"] = (receipt[0].shipping_details["can_mark_as_shipped"]) ? "Shipped" : "Not Shipped";
        Lightbox["shipping_method"] = receipt[0].shipping_details["shipping_method"];

        $scope.images = [
            {
                'url': image_url,
                'thumbUrl': thumb_url
            }
        ];
        Lightbox.openModal($scope.images, 0);
        console.log(Lightbox);
    };

    $scope.connectToFacebook = function() {
        facebookService.login().then(function (response) {
            facebookService.getPages().then(function(response) {
                console.log("About to post message");
                facebookService.postMessage("Hello, World");
            });
        });
    }
    $scope.announcementText = "";
    $scope.postAnnouncement = function() {
        facebookService.postMessage($scope.announcementText);
    }

    $scope.loginTwitterButtonPress = function () {
        $window.location.href='/login3';
    }

    $scope.verifyTwitter = function () {
        $window.location.href='/verify-twitter';
    }

}
