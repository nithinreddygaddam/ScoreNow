'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Runs Schema
 */
var Runs = new Schema({
    batsman: {
    	type: Number
    },
  	extras: {
  		type: Number
  	},
    total: {
    	type: Number
    },
});

/**
 * Wicket Schema
 */
var Wicket = new Schema({
	fielder1: {
		type: Schema.ObjectId,
		ref: 'Player'
	},
	fielder2: {
		type: Schema.ObjectId,
		ref: 'Player'
	},
	kind: {
    	type: String
	},
	player_out: {
		type: Schema.ObjectId,
		ref: 'Player'
	}
});

/**
 * Delivery Schema
 */
var DeliverySchema = new Schema({
	innings: {
		type: Schema.ObjectId,
		ref: 'Innings'
	},
	delivery: {
    	type: Number
    },
	batsman: {
		type: Schema.ObjectId,
		ref: 'Player'
	},
	bowler: {
		type: Schema.ObjectId,
		ref: 'Player'
	},
	non_striker: {
		type: Schema.ObjectId,
		ref: 'Player'
	},
	runs: {
		type: [Runs]
	},
	wicket: {
		type: [Wicket]
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Delivery', DeliverySchema);
