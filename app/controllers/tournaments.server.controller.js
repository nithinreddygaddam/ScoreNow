'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Tournament = mongoose.model('Tournament'),
    _ = require('lodash');

/**
 * Create a Tournament
 */
exports.create = function(req, res) {
	var tournament = new Tournament(req.body);

	tournament.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.status(201).json(tournament);
		}
	});
};

/**
 * Show the current Tournament
 */
exports.read = function(req, res) {
	res.json(req.tournament);
};

/**
 * Update a Tournament
 */
exports.update = function(req, res) {
	var tournament = req.tournament;

	tournament = _.extend(tournament, req.body);

	tournament.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(tournament);
		}
	});
};

/**
 * Delete an Tournament
 */
exports.delete = function(req, res) {
	var tournament = req.tournament;

	tournament.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(tournament);
		}
	});
};

/**
 * List of Tournaments
 */
exports.list = function(req, res) {
	Tournament.find().sort('name').exec(function(err, tournaments) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(tournaments);
		}
	});
};

/**
 * Tournament middleware
 */
exports.tournamentByID = function(req, res, next, id) {

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).send({
			message: 'Tournament is invalid'
		});
	}

	Tournament.findById(id).exec(function(err, tournament) {
		if (err) return next(err);
		if (!tournament) {
			return res.status(404).send({
  				message: 'Tournament not found'
  			});
		}
		req.tournament = tournament;
		next();
	});
};