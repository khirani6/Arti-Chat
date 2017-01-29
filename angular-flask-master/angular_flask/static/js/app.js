'use strict';

angular.module('AngularFlask', ['angularFlaskServices'])
	.config(['$routeProvider', '$locationProvider',
		function($routeProvider, $locationProvider) {
		    $routeProvider.when('/', {
    			templateUrl: 'static/partials/login.html',
    			controller: LoginController
    		})
    		.when('/about', {
    			templateUrl: 'static/partials/about.html',
    			controller: AboutController
    		})
    		.when('/post', {
    			templateUrl: 'static/partials/post-list.html',
    			controller: PostListController
    		})
    		.when('/post/:postId', {
    			templateUrl: '/static/partials/post-detail.html',
    			controller: PostDetailController
    		})
    		/* Create a "/blog" route that takes the user to the same place as "/post" */
    		.when('/blog', {
    			templateUrl: 'static/partials/post-list.html',
    			controller: PostListController
    		})
    		.when('/login', {
    			templateUrl: 'static/partials/login.html',
    			controller: LoginController
    		})
    		.when('/home', {
    			templateUrl: 'static/partials/home.html',
    			controller: HomeController
    		})
    		.otherwise({
    			redirectTo: '/'
    		});

            $locationProvider.html5Mode(true);
	}])
;
