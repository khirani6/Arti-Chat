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
	})
    .factory('loginFactory', function($resource) {
        return $resource('/login2', {}, {
            query: {
                method: 'GET'
            }
        })
    })
    .factory('testingFactory', function($resource) {
        return $resource('https://openapi.etsy.com/v2/users/etsystore?api_key=fvfa290fd1oj7mz3q9sz8de3', {}, {
            query: {
                method: 'GET'
            }
        })
    });
