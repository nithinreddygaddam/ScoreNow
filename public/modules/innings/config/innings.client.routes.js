'use strict';

//Setting up route
angular.module('innings').config(['$stateProvider',
	function($stateProvider) {
		// Innings state routing
		$stateProvider.
		state('listInnings', {
			url: '/innings',
			templateUrl: 'modules/innings/views/list-innings.client.view.html'
		}).
		state('createInning', {
			url: '/innings/create',
			templateUrl: 'modules/innings/views/create-inning.client.view.html'
		}).
		state('viewInning', {
			url: '/innings/:inningId',
			templateUrl: 'modules/innings/views/view-inning.client.view.html'
		}).
		state('editInning', {
			url: '/innings/:inningId/edit',
			templateUrl: 'modules/innings/views/edit-inning.client.view.html'
		});
	}
]);