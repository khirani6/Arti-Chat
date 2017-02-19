'use strict';

angular.module('angularFlaskServices', ['ngResource'])
	.factory('Post', function($resource) {
		return $resource('/api/post/:postId', {}, {
			query: {
				method: 'GET',
				params: { postId: '' },
				isArray: true
			}
		});
	}).factory('Shops', function($resource) {
		return $resource('/shops', {}, {
			query: {
				method: 'GET',
				isArray: true
			}
		});
	}).factory('ActiveShopListings', function($resource) {
		return $resource('/shops/:shop_id/listings/active', {}, {
			query: {
				method: 'GET',
                params: { shop_id: '@shop_id'},
				isArray: false,
                include_private: true
			}
		});
	}).factory('ListingThumbnails', function($resource) {
		return $resource('/listings/:listing_id/images', {}, {
			query: {
				method: 'GET',
                params: { listing_id: '@listing_id'},
				isArray: true
			}
		});
	}).factory('ListingTransactions', function($resource) {
		return $resource('/shops/:shop_id/transactions', {}, {
			query: {
				method: 'GET',
                params: { shop_id: '@shop_id'},
				isArray: true
			}
		});
	}).factory('UserProfileFactory', function($resource) {
		return $resource('/users/:user_id/profile', {}, {
			query: {
				method: 'GET',
                params: { user_id: '@user_id'}
			}
		});
	}).factory('UserFactory', function($resource) {
		return $resource('/users/:user_id', {}, {
			query: {
				method: 'GET',
                params: { user_id: '@user_id'}
			}
		});
	}).factory('ReceiptFactory', function($resource) {
		return $resource('/receipts/:receipt_id', {}, {
			query: {
				method: 'GET',
                params: { receipt_id: '@receipt_id'}
			}
		});
	})
	.factory('facebookService', function($q) {
		var user = {};
	    return {
	    	login: function() {
	    		var deferred = $q.defer();
	    		FB.login(function () {}, {scope: 'manage_pages, publish_pages'});
	            FB.api('/me', {}, function(response) {
	                if (!response || response.error) {
	                    deferred.reject('Error occured');
	                } else {
	                	user.name = response.name;
	                	user.id = response.id;
	                	console.log(user.id);
	                    deferred.resolve(response);
	                }
	            });
	            return deferred.promise;
	        },
	        getPages: function () {
	        	var deferred = $q.defer();
	        	FB.api('/' + user.id + '/accounts/', {}, function(response) {
	        		if (!response || response.error) {
	                    deferred.reject('Error occured');
	                } else {
	                	user.page_id = response.data[0].id;
	                	user.page_access_token = response.data[0].access_token;
	                	console.log("Setting page id: " + user.page_id);
	                    deferred.resolve(response);
	                }
	        	});
	            return deferred.promise;
	        },
	        postMessage: function (message) {
	        	var deferred = $q.defer();
	        	console.log("Line before posting message");
	        	var url = '/' + user.page_id + '/feed';
	        	console.log("url = " + url);
	        	console.log("message = " + message);
	        	FB.api(url, 'post', {access_token: user.page_access_token, message: message} , function (response) {
	        		if (!response || response.error) {
	                    console.log("post failure");
	                    console.log(JSON.stringify(response));
	                    deferred.reject('Error occured');
	                } else {
	                	console.log("post success");
	                    deferred.resolve(response);
	                }
	        	});
	            return deferred.promise;
	        }

	    }
	});

