'use strict';

//Innings service used to communicate Innings REST endpoints
angular.module('innings').factory('Innings', ['$resource',
	function($resource) {
		return $resource('innings/:inningId', { inningId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);