'use strict';

angular.module('score-sheet').controller('ScoreSheetController', ['$scope', '$stateParams','Authentication', 'Matches', 'Teams', '$filter',
	function($scope, $stateParams, Authentication, Matches, Teams, $filter) {
		$scope.authentication = Authentication;
		$scope.teams = Teams.query();
		// Controller Logic
		// ...

		// Find existing Match
		$scope.findOne = function() {

		$scope.match = Matches.get({ 
				matchId: $stateParams.matchId
			}, appendTeam);
		};

		var appendTeam = function appendTeam(p) {
			// You could substitue use of filter here with underscore etc.
			p.team = $filter('filter')($scope.teams, {_id: p.team})[0];
		};
	}
]);