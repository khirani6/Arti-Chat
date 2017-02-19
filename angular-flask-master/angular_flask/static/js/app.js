"use strict";

angular.module("AngularFlask", ["ui.bootstrap", "ngRoute", "ngResource", "angularFlaskServices", "bootstrapLightbox"]).config(["$routeProvider", "$locationProvider", "$qProvider", "LightboxProvider",

	function($routeProvider, $locationProvider, $qProvider, LightboxProvider) {
		$routeProvider.when("/", {
			templateUrl: "static/partials/login.html",
			controller: LoginController
		})
		.when("/about", {
			templateUrl: "static/partials/about.html",
			controller: AboutController
		})
		.when("/post", {
			templateUrl: "static/partials/post-list.html",
			controller: PostListController
		})
		.when("/post/:postId", {
			templateUrl: "/static/partials/post-detail.html",
			controller: PostDetailController
		})
		/* Create a "/blog" route that takes the user to the same place as "/post" */
		.when("/blog", {
			templateUrl: "static/partials/post-list.html",
			controller: PostListController
		})
		.when("/login", {
			templateUrl: "static/partials/login.html",
			controller: LoginController
		})
		.when("/home", {
			templateUrl: "static/partials/home2.html",
			controller: HomeController
		})
		.otherwise({
			redirectTo: "/"
		});

		$locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });

        LightboxProvider.templateUrl = "/templates/lightbox.html";
        //LightboxProvider.fullScreenMode = true;
        //
        $qProvider.errorOnUnhandledRejections(false);
	}])

	.run(['$rootScope', '$window',
	  function($rootScope, $window) {

	  $rootScope.user = {};

	  $window.fbAsyncInit = function() {
	  	FB.init({ 
	      appId: '1856652787949161',
	      status: true, 
	      cookie: true, 
	      xfbml: true,
	      version: 'v2.4'
	    });
	  };

	(function(d, s, id){
		var js, fjs = d.getElementsByTagName(s)[0];
		if (d.getElementById(id)) {return;}
		js = d.createElement(s); js.id = id;
		js.src = "//connect.facebook.net/en_US/sdk.js";
		fjs.parentNode.insertBefore(js, fjs);
   	}(document, 'script', 'facebook-jssdk'));

	}]);

