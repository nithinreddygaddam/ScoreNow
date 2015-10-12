'use strict';

//Matches service used to communicate Matches REST endpoints
angular.module('matches').factory('Matches', ['$resource',
	function($resource) {
		return $resource('matches/:matchId', { matchId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);