'use strict';

//Setting up route
angular.module('deliveries').config(['$stateProvider',
	function($stateProvider) {
		// Deliveries state routing
		$stateProvider.
		state('listDeliveries', {
			url: '/deliveries',
			templateUrl: 'modules/deliveries/views/list-deliveries.client.view.html'
		}).
		state('createDelivery', {
			url: '/deliveries/create',
			templateUrl: 'modules/deliveries/views/create-delivery.client.view.html'
		}).
		state('viewDelivery', {
			url: '/deliveries/:deliveryId',
			templateUrl: 'modules/deliveries/views/view-delivery.client.view.html'
		}).
		state('editDelivery', {
			url: '/deliveries/:deliveryId/edit',
			templateUrl: 'modules/deliveries/views/edit-delivery.client.view.html'
		});
	}
]);