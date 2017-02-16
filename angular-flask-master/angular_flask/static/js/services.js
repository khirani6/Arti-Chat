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
	});
