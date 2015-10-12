'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Match Schema
 */
var MatchSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Match name',
		trim: true
	},
	teamA: {
		type: Schema.ObjectId,
		ref: 'Team'
	},
	teamB: {
		type: Schema.ObjectId,
		ref: 'Team'
	},
	//should be in tournamnet ***********************
	overs: {
		type: Number,
		default: 3,
		trim: true
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

mongoose.model('Match', MatchSchema);