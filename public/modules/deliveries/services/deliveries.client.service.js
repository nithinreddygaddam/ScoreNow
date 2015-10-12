'use strict';

//Deliveries service used to communicate Deliveries REST endpoints
angular.module('deliveries').factory('Deliveries', ['$resource',
	function($resource) {
		return $resource('deliveries/:deliveryId', { deliveryId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);