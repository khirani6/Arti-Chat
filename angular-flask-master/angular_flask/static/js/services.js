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
	});
