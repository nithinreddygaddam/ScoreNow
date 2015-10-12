'use strict';

// Deliveries controller
angular.module('deliveries').controller('DeliveriesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Deliveries',
	function($scope, $stateParams, $location, Authentication, Deliveries) {
		$scope.authentication = Authentication;

		// Create new Delivery
		$scope.create = function() {
			// Create new Delivery object
			var delivery = new Deliveries ({
				name: this.name
			});

			// Redirect after save
			delivery.$save(function(response) {
				$location.path('deliveries/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Delivery
		$scope.remove = function(delivery) {
			if ( delivery ) { 
				delivery.$remove();

				for (var i in $scope.deliveries) {
					if ($scope.deliveries [i] === delivery) {
						$scope.deliveries.splice(i, 1);
					}
				}
			} else {
				$scope.delivery.$remove(function() {
					$location.path('deliveries');
				});
			}
		};

		// Update existing Delivery
		$scope.update = function() {
			var delivery = $scope.delivery;

			delivery.$update(function() {
				$location.path('deliveries/' + delivery._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Deliveries
		$scope.find = function() {
			$scope.deliveries = Deliveries.query();
		};

		// Find existing Delivery
		$scope.findOne = function() {
			$scope.delivery = Deliveries.get({ 
				deliveryId: $stateParams.deliveryId
			});
		};
	}
]);