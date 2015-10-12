'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var deliveries = require('../../app/controllers/deliveries.server.controller');

	// Deliveries Routes
	app.route('/deliveries')
		.get(deliveries.list)
		.post(users.requiresLogin, deliveries.create);

	app.route('/deliveries/:deliveryId')
		.get(deliveries.read)
		.put(users.requiresLogin, deliveries.hasAuthorization, deliveries.update)
		.delete(users.requiresLogin, deliveries.hasAuthorization, deliveries.delete);

	// Finish by binding the Delivery middleware
	app.param('deliveryId', deliveries.deliveryByID);
};
