'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Inning Schema
 */
var InningSchema = new Schema({
	Innings: {
		type: Number
	},
	match: {
		type: Schema.ObjectId,
		ref: 'Match'
	},
	team: {
		type: Schema.ObjectId,
		ref: 'Team'
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

mongoose.model('Inning', InningSchema);