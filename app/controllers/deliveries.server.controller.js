'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Delivery = mongoose.model('Delivery'),
	_ = require('lodash');

/**
 * Create a Delivery
 */
exports.create = function(req, res) {
	var delivery = new Delivery(req.body);
	delivery.user = req.user;

	delivery.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(delivery);
		}
	});
};

/**
 * Show the current Delivery
 */
exports.read = function(req, res) {
	res.jsonp(req.delivery);
};

/**
 * Update a Delivery
 */
exports.update = function(req, res) {
	var delivery = req.delivery ;

	delivery = _.extend(delivery , req.body);

	delivery.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(delivery);
		}
	});
};

/**
 * Delete an Delivery
 */
exports.delete = function(req, res) {
	var delivery = req.delivery ;

	delivery.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(delivery);
		}
	});
};

/**
 * List of Deliveries
 */
exports.list = function(req, res) { 
	Delivery.find().sort('-created').populate('user', 'displayName').exec(function(err, deliveries) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(deliveries);
		}
	});
};

/**
 * Delivery middleware
 */
exports.deliveryByID = function(req, res, next, id) { 
	Delivery.findById(id).populate('user', 'displayName').exec(function(err, delivery) {
		if (err) return next(err);
		if (! delivery) return next(new Error('Failed to load Delivery ' + id));
		req.delivery = delivery ;
		next();
	});
};

/**
 * Delivery authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.delivery.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
