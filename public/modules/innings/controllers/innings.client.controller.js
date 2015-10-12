'use strict';

// Innings controller
angular.module('innings').controller('InningsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Innings',
	function($scope, $stateParams, $location, Authentication, Innings) {
		$scope.authentication = Authentication;

		// Create new Inning
		$scope.create = function() {
			// Create new Inning object
			var inning = new Innings ({
				name: this.name
			});

			// Redirect after save
			inning.$save(function(response) {
				$location.path('innings/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Inning
		$scope.remove = function(inning) {
			if ( inning ) { 
				inning.$remove();

				for (var i in $scope.innings) {
					if ($scope.innings [i] === inning) {
						$scope.innings.splice(i, 1);
					}
				}
			} else {
				$scope.inning.$remove(function() {
					$location.path('innings');
				});
			}
		};

		// Update existing Inning
		$scope.update = function() {
			var inning = $scope.inning;

			inning.$update(function() {
				$location.path('innings/' + inning._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Innings
		$scope.find = function() {
			$scope.innings = Innings.query();
		};

		// Find existing Inning
		$scope.findOne = function() {
			$scope.inning = Innings.get({ 
				inningId: $stateParams.inningId
			});
		};
	}
]);