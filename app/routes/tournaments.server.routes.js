'use strict';

module.exports = function(app) {
    var tournaments = require('../../app/controllers/tournaments.server.controller');
    var users = require('../../app/controllers/users.server.controller');

    app.route('/tournaments')
        .get(tournaments.list)
        .post(users.requiresLogin, tournaments.create);

    app.route('/tournaments/:tournamentId')
        .get(tournaments.read)
        .put(users.requiresLogin, tournaments.update)
        .delete(users.requiresLogin, tournaments.delete);

    // Finish by binding the article middleware
    app.param('tournamentId', tournaments.tournamentByID);
};