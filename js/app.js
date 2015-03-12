// Ionic Starter App 
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('Watch', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.controller('WatchTest', function($scope) {
	var updateClock = function() {
		$scope.clock = new Date();
	};
	setInterval(function() { $scope.$apply(updateClock); }, 1000);
	updateClock();
})

.directive("createClock", function($window) {
	return {
		restrict: "EA",
		template: "<svg class='clock1' width='400' height='400'></svg>",
		link: d3clockfunc
	};
})
