'use strict';

//Setting up route
angular.module('score-sheet').config(['$stateProvider',
	function($stateProvider) {
		// Score sheet state routing
		$stateProvider.
		state('new-score-sheet', {
			url: '/score-sheetnew',
			templateUrl: 'modules/score-sheet/views/new-score-sheet.client.view.html'
		}).
		state('score-sheet', {
			url: '/score-sheet',
			templateUrl: 'modules/score-sheet/views/score-sheet.client.view.html'
		});
	}
]);