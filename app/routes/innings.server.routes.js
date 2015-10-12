'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var innings = require('../../app/controllers/innings.server.controller');

	// Innings Routes
	app.route('/innings')
		.get(innings.list)
		.post(users.requiresLogin, innings.create);

	app.route('/innings/:inningId')
		.get(innings.read)
		.put(users.requiresLogin, innings.hasAuthorization, innings.update)
		.delete(users.requiresLogin, innings.hasAuthorization, innings.delete);

	// Finish by binding the Inning middleware
	app.param('inningId', innings.inningByID);
};
