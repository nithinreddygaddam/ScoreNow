'use strict';

// Players controller
angular.module('players').controller('PlayersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Players', 'Teams', '$filter',
	function($scope, $stateParams, $location, Authentication, Players, Teams, $filter) {
		$scope.authentication = Authentication;
		$scope.teams = Teams.query();

		// Create new Player
		$scope.create = function() {
			// Create new Player object
			var player = new Players ({
				name: this.name,
				team: this.team
			});

			// Redirect after save
			player.$save(function(response) {
				$location.path('players/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Player
		$scope.remove = function(player) {
			if ( player ) { 
				player.$remove();

				for (var i in $scope.players) {
					if ($scope.players [i] === player) {
						$scope.players.splice(i, 1);
					}
				}
			} else {
				$scope.player.$remove(function() {
					$location.path('players');
				});
			}
		};

		// Update existing Player
		$scope.update = function() {
			var player = $scope.player;

			player.$update(function() {
				$location.path('players/' + player._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Players
		$scope.find = function() {
			Players.query(function loadedPlayers(players) {
				players.forEach(appendTeam);
				$scope.players = players;
			});
		};

		var appendTeam = function appendTeam(p) {
			// You could substitue use of filter here with underscore etc.
			p.team = $filter('filter')($scope.teams, {_id: p.team})[0];
		};

		// Find existing Player
		$scope.findOne = function() {
			$scope.player = Players.get({ 
				playerId: $stateParams.playerId
			}, appendTeam);
		};
	}
]);