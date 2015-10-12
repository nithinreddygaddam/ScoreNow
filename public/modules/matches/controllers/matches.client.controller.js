'use strict';

// Matches controller
angular.module('matches').controller('MatchesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Matches', 'Teams', '$filter',
	function($scope, $stateParams, $location, Authentication, Matches, Teams, $filter) {
		$scope.authentication = Authentication;
		$scope.teams = Teams.query();

		// Create new Match
		$scope.create = function() {
			// Create new Match object
			var match = new Matches ({
				name: this.name,
				teamA: this.teamA,
				teamB: this.teamB,
				overs: this.overs
			});

			// Redirect after save
			match.$save(function(response) {
				$location.path('scoreMatch/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Match
		$scope.remove = function(match) {
			if ( match ) { 
				match.$remove();

				for (var i in $scope.matches) {
					if ($scope.matches [i] === match) {
						$scope.matches.splice(i, 1);
					}
				}
			} else {
				$scope.match.$remove(function() {
					$location.path('matches');
				});
			}
		};

		// Update existing Match
		$scope.update = function() {
			var match = $scope.match;

			match.$update(function() {
				$location.path('matches/' + match._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Matches
		$scope.find = function() {

			Matches.query(function loadedMatches(matches) {
				matches.forEach(appendTeam);
				$scope.matches = matches;
			});
		};

		var appendTeam = function appendTeam(p) {
			// You could substitue use of filter here with underscore etc.
			p.teamA = $filter('filter')($scope.teams, {_id: p.teamA})[0];
			p.teamB = $filter('filter')($scope.teams, {_id: p.teamB})[0];
		};

		// Find existing Match
		$scope.findOne = function() {

		$scope.match = Matches.get({ 
				matchId: $stateParams.matchId
			}, appendTeam);
		};
	}
]);