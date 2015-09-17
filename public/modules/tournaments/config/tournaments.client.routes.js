'use strict';

//Setting up route
angular.module('tournaments').config(['$stateProvider',
	function($stateProvider) {
		// Tournaments state routing
		$stateProvider.
		state('listTournaments', {
			url: '/tournaments',
			templateUrl: 'modules/tournaments/views/tournaments.client.view.html'
		}).
		state('createTournament', {
			url: '/tournaments/create',
			templateUrl: 'modules/tournaments/views/create-tournament.client.view.html'
		}).
		state('viewTournament', {
			url: '/tournaments/:tournamentId',
			templateUrl: 'modules/tournaments/views/view-tournament.client.view.html'
		}).
		state('editTournament', {
			url: '/tournaments/:tournamentId/edit',
			templateUrl: 'modules/tournaments/views/edit-tournament.client.view.html'
		});
	}
]);
