'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var matches = require('../../app/controllers/matches.server.controller');

	// Matches Routes
	app.route('/matches')
		.get(matches.list)
		.post(users.requiresLogin, matches.create);

	app.route('/matches/:matchId')
		.get(matches.read)
		.put(users.requiresLogin, matches.hasAuthorization, matches.update)
		.delete(users.requiresLogin, matches.hasAuthorization, matches.delete);

	// Finish by binding the Match middleware
	app.param('matchId', matches.matchByID);
};
