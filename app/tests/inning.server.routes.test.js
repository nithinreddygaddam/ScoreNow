'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Inning = mongoose.model('Inning'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, inning;

/**
 * Inning routes tests
 */
describe('Inning CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Inning
		user.save(function() {
			inning = {
				name: 'Inning Name'
			};

			done();
		});
	});

	it('should be able to save Inning instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Inning
				agent.post('/innings')
					.send(inning)
					.expect(200)
					.end(function(inningSaveErr, inningSaveRes) {
						// Handle Inning save error
						if (inningSaveErr) done(inningSaveErr);

						// Get a list of Innings
						agent.get('/innings')
							.end(function(inningsGetErr, inningsGetRes) {
								// Handle Inning save error
								if (inningsGetErr) done(inningsGetErr);

								// Get Innings list
								var innings = inningsGetRes.body;

								// Set assertions
								(innings[0].user._id).should.equal(userId);
								(innings[0].name).should.match('Inning Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Inning instance if not logged in', function(done) {
		agent.post('/innings')
			.send(inning)
			.expect(401)
			.end(function(inningSaveErr, inningSaveRes) {
				// Call the assertion callback
				done(inningSaveErr);
			});
	});

	it('should not be able to save Inning instance if no name is provided', function(done) {
		// Invalidate name field
		inning.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Inning
				agent.post('/innings')
					.send(inning)
					.expect(400)
					.end(function(inningSaveErr, inningSaveRes) {
						// Set message assertion
						(inningSaveRes.body.message).should.match('Please fill Inning name');
						
						// Handle Inning save error
						done(inningSaveErr);
					});
			});
	});

	it('should be able to update Inning instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Inning
				agent.post('/innings')
					.send(inning)
					.expect(200)
					.end(function(inningSaveErr, inningSaveRes) {
						// Handle Inning save error
						if (inningSaveErr) done(inningSaveErr);

						// Update Inning name
						inning.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Inning
						agent.put('/innings/' + inningSaveRes.body._id)
							.send(inning)
							.expect(200)
							.end(function(inningUpdateErr, inningUpdateRes) {
								// Handle Inning update error
								if (inningUpdateErr) done(inningUpdateErr);

								// Set assertions
								(inningUpdateRes.body._id).should.equal(inningSaveRes.body._id);
								(inningUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Innings if not signed in', function(done) {
		// Create new Inning model instance
		var inningObj = new Inning(inning);

		// Save the Inning
		inningObj.save(function() {
			// Request Innings
			request(app).get('/innings')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Inning if not signed in', function(done) {
		// Create new Inning model instance
		var inningObj = new Inning(inning);

		// Save the Inning
		inningObj.save(function() {
			request(app).get('/innings/' + inningObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', inning.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Inning instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Inning
				agent.post('/innings')
					.send(inning)
					.expect(200)
					.end(function(inningSaveErr, inningSaveRes) {
						// Handle Inning save error
						if (inningSaveErr) done(inningSaveErr);

						// Delete existing Inning
						agent.delete('/innings/' + inningSaveRes.body._id)
							.send(inning)
							.expect(200)
							.end(function(inningDeleteErr, inningDeleteRes) {
								// Handle Inning error error
								if (inningDeleteErr) done(inningDeleteErr);

								// Set assertions
								(inningDeleteRes.body._id).should.equal(inningSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Inning instance if not signed in', function(done) {
		// Set Inning user 
		inning.user = user;

		// Create new Inning model instance
		var inningObj = new Inning(inning);

		// Save the Inning
		inningObj.save(function() {
			// Try deleting Inning
			request(app).delete('/innings/' + inningObj._id)
			.expect(401)
			.end(function(inningDeleteErr, inningDeleteRes) {
				// Set message assertion
				(inningDeleteRes.body.message).should.match('User is not logged in');

				// Handle Inning error error
				done(inningDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Inning.remove().exec();
		done();
	});
});