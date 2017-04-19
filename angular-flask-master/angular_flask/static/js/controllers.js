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
    $scope.madeConsistent = false;
    $scope.listView = false;

    $scope.thumbnails = {};
    $scope.transactions = {}; //lookup by listing id
    $scope.buyers = {}; //lookup by buyer profile id
    $scope.receipts = {}; //index by receipt ID
    $scope.emails = {};
    $scope.search = "";
	$scope.tab = 1;


    $scope.facebookConnected = false;
    $scope.twitterConnected = false;

    $scope.transactionsListView = [];

    $scope.setTab = function(newTab) {
      $scope.tab = newTab;
      console.log($scope.transactions);
    };

    $scope.isSet = function(tabNum) {
      return ($scope.tab === tabNum);
    };

    $scope.toggleListView = function() {
        $scope.listView = !$scope.listView;
    }

   	var user_data = user_data_global.replace(new RegExp("&#34;", "g"), "\"");
	$scope.user_data = JSON.parse(user_data);
    console.log($scope.user_data);

    $scope.isLoggedIn = ($scope.user_data != null); //temp way of handling this
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
            $scope.track = []


            var transactions_req = ListingTransactions.get({ shop_id: shop_id }, function(transactions) {
                for (var transaction of transactions.results) {
                    $scope.transactions[transaction.listing_id] = [];
                }

                for (var transaction of transactions.results) {
                    console.log(transaction);
                    transaction.time = $scope.epoch_seconds_to_local_time(transaction.creation_tsz);

                    let user_id = transaction.buyer_user_id;
                    var user_profile = UserFactory.get({ user_id: user_id }, function(data) {
                        $scope.buyers[user_id] = data.results;
                        $scope.finished_loading = true;
                        transaction.buyer_name = data.results[transaction.buyer_user_id][0].login_name;
                        transaction.cost = $scope.calculate_cost(transaction.price, transaction.quantity);
                        $scope.make_consistent();
                    });

                    $scope.transactions[transaction.listing_id].push(transaction);


                    let receipt_id = transaction.receipt_id;
                    var receipt = ReceiptFactory.get({ receipt_id: receipt_id} , function(data) {
                        $scope.receipts[receipt_id] = data.results;
                        if ($scope.receipts[receipt_id]) {
                            $scope.emails[transaction.buyer_user_id] = $scope.receipts[receipt_id][0].buyer_email;
                        }
                        $scope.make_consistent();
                    });

                    $scope.transactionsListView.push(transaction);
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

    $scope.are_transactions_present = function (listing) {

    };

    $scope.make_consistent = function() {
        if (!$scope.madeConsistent) {
            //Testing Data
            var possibleStatuses = ["Awaiting payment.", "Shipped", "Not Shipped"];
            var possibleNames = ["kim", "george", "robert", "john", "james", "sarah", "mike", "justin", "angela"]
            if ($scope.shop_listings) {
                for (var listing of $scope.shop_listings.results) {
                    for (var x = 0; x < 4; x++) {
                        var creation_tsz = Math.round((Math.random() * (1487225264 - (1487225264 + 10000000/2)) + (1487225264 + 10000000/2)));
                        var buyer_name = possibleNames[Math.floor(Math.random() * possibleNames.length)];

                        var quantity = Math.round((Math.random() * (1 - 10) + 10));

                        var test_trans = {
                            buyer_user_id: -x,
                            buyer_name: buyer_name,
                            price: listing.price,
                            quantity: quantity,
                            cost: $scope.calculate_cost(listing.price, quantity, 1),
                            grandtotal: $scope.calculate_cost(listing.price, quantity, 1) - 6,
                            creation_tsz: creation_tsz,
                            time:  $scope.epoch_seconds_to_local_time(creation_tsz),
                            status: possibleStatuses[Math.round(Math.random() * (0 - 2) + 2)],
                            listing_id: listing.listing_id,
                            shipping_method: "USPS",
                            receipt_id: $scope.randomReceipt(),
                            tracking: null
                        }

                        for (var i = possibleNames.length-1; i >= 0; i--) {
                            if (possibleNames[i] === buyer_name) {
                                possibleNames.splice(i, 1);
                            }
                        }
                        test_trans["buyer_name"] += $scope.randomString();
                        if (test_trans.status === "Shipped") {
                            test_trans.tracking = $scope.randomUSPS();
                        }



                        $scope.emails[test_trans.buyer_user_id] = $scope.randomString() + "@gmail.com";

                        $scope.transactions[listing.listing_id].push(test_trans);
                        $scope.transactionsListView.push(test_trans);
                        //$scope.buyers[test_trans.buyer_user_id] = "hey";
                    }
                }
            }


            $scope.madeConsistent = true;
        }

        for (var key in $scope.transactions) {
            var curr_transactions = $scope.transactions[key];
            for (var i = 0; i < curr_transactions.length; i++) {
                var transaction = curr_transactions[i];
                if ($scope.buyers[transaction.buyer_user_id]) {
                    $scope.transactions[key][i].buyer_name = $scope.buyers[transaction.buyer_user_id][0].login_name;
                }

                if ($scope.receipts[transaction.receipt_id]) {
                    $scope.transactions[key][i].status = $scope.receipts[transaction.receipt_id][0].was_paid ? "Ready to be shipped." : "Awaiting payment.";
                }


                if (!$scope.transactions[key][i].cost) {
                    $scope.transactions[key][i].cost = $scope.calculate_cost(transaction.price, quantity);
                }

            }
        }
    }

	$scope.logout = function() {
        $rootScope.isLoggedIn = false;
        $scope.isLoggedIn = false;
		$window.location.href= '/login';
	};

    $scope.epoch_seconds_to_local_time = function(str) {
        var temp = parseInt(str);
        var d = new Date(temp * 1000);
        return (d.toLocaleDateString() + " @ " + d.toLocaleTimeString());
    };

    $scope.calculate_cost = function(price, quantity, shipped) {
        var s = (shipped != null) ? 3.73 : 0;
        return (parseFloat(price) * quantity + s).toFixed(2);
    };

    $scope.expand_order_details = function(transaction) {
        var listing_id = transaction.listing_id;
        console.log(transaction);
        var image_url = $scope.thumbnails[listing_id][0].url_170x135;
        var thumb_url = $scope.thumbnails[listing_id][0].url_75x75;

        Lightbox["buyer_name"] = $scope.transactions[transaction.listing_id].buyer_name || transaction.buyer_name;
        Lightbox["price"] = transaction.price;
        Lightbox["receipt_id"] = transaction.receipt_id;

        var receipt = $scope.receipts[transaction.receipt_id];
        console.log(receipt);
        Lightbox["shipped"] = transaction.status;
        Lightbox["tracking"] = transaction.tracking;
        if (receipt) {
            Lightbox["shipping_method"] = receipt[0].shipping_details["shipping_method"];
        } else {
            Lightbox["shipping_method"] = transaction.shipping_method
        }

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
                $scope.facebookConnected = true;
            });
        });
    };

    $scope.announcementText = "";
    $scope.verifyTwitterText = "";
    var email = false;
    var fb = false;
    var twitter = false;

    $scope.emailClick = function() {
        if (email == true) {
            email = false;
        } else if (email == false) {
            email = true;
        }
    }

    $scope.fbClick = function() {
        if (fb == true) {
            fb = false;
        } else if (fb == false) {
            fb = true;
        }
    }

    $scope.twitterClick = function() {
        if (twitter == true) {
            twitter = false;
        } else if (twitter == false) {
            twitter = true;
        }
    }

    $scope.postAnnouncement = function(){
        if (fb) {
            facebookService.postMessage($scope.announcementText);
        }
        if (twitter) {
            var url = "/tweet/" + $scope.announcementText;
            $window.location.href=url;
        }

    }

    $scope.loginTwitterButtonPress = function() {
        $window.open("/login3", "_blank");
        // $window.location.href='/login3';
    }

    $scope.verifyTwitter = function() {
        var url = "/verify-twitter/" + $scope.verifyTwitterText;
        $window.location.href = url;
        $scope.twitterConnected = true;
    };

    $scope.randomString = function() {
        var text = "";
        var possible = "0123456789";

        for (var i = 0; i < 4; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return text;
    }

    $scope.randomReceipt = function() {
        var text = "";
        var possible = "0123456789";

        for (var i = 0; i < 10; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return text;
    }

    $scope.randomUSPS = function() {
        var text = "";
        var possible = "0123456789";

        for (var i = 0; i < 22; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return text;
    }

    $scope.setView = function (x) {
        $scope.listView = (x == 0);
    }
    $scope.availableSearchParams = [
        { key: "price", name: "Price", placeholder: "Price..." },
        { key: "buyer_name", name: "Name", placeholder: "Name..." },
        { key: "emailAddress", name: "E-Mail", placeholder: "E-Mail...", allowMultiple: true },
        { key: "time", name: "Time", placeholder: "Time..." }
    ];
}
