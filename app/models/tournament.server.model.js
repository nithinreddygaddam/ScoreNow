'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Validation
 */
function validateLength (v) {
  // a custom validation function for checking string length
  return v.length <= 15;
}

/**
 * Tournament Schema
 */
var TournamentSchema = new Schema({
    created: {          // the property name
        type: Date,     // types are defined e.g. String, Date, Number - http://mongoosejs.com/docs/guide.html
        default: Date.now
    },
    description: {
        type: String,
        default: '',
        trim: true      // types have specific functions e.g. trim, lowercase, uppercase - http://mongoosejs.com/docs/api.html#schema-string-js
    },
    name: {
        type: String,
        default: '',
        trim: true,     
        unique : true,
        required: 'name cannot be blank',
        validate: [validateLength, 'name must be 15 chars in length or less'] // wires into our custom validator function - http://mongoosejs.com/docs/api.html#schematype_SchemaType-validate
    }
});

// Expose the model to other objects (similar to a 'public' setter).
mongoose.model('Tournament', TournamentSchema);