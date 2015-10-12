'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Delivery = mongoose.model('Delivery'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, delivery;

/**
 * Delivery routes tests
 */
describe('Delivery CRUD tests', function() {
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

		// Save a user to the test db and create new Delivery
		user.save(function() {
			delivery = {
				name: 'Delivery Name'
			};

			done();
		});
	});

	it('should be able to save Delivery instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Delivery
				agent.post('/deliveries')
					.send(delivery)
					.expect(200)
					.end(function(deliverySaveErr, deliverySaveRes) {
						// Handle Delivery save error
						if (deliverySaveErr) done(deliverySaveErr);

						// Get a list of Deliveries
						agent.get('/deliveries')
							.end(function(deliveriesGetErr, deliveriesGetRes) {
								// Handle Delivery save error
								if (deliveriesGetErr) done(deliveriesGetErr);

								// Get Deliveries list
								var deliveries = deliveriesGetRes.body;

								// Set assertions
								(deliveries[0].user._id).should.equal(userId);
								(deliveries[0].name).should.match('Delivery Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Delivery instance if not logged in', function(done) {
		agent.post('/deliveries')
			.send(delivery)
			.expect(401)
			.end(function(deliverySaveErr, deliverySaveRes) {
				// Call the assertion callback
				done(deliverySaveErr);
			});
	});

	it('should not be able to save Delivery instance if no name is provided', function(done) {
		// Invalidate name field
		delivery.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Delivery
				agent.post('/deliveries')
					.send(delivery)
					.expect(400)
					.end(function(deliverySaveErr, deliverySaveRes) {
						// Set message assertion
						(deliverySaveRes.body.message).should.match('Please fill Delivery name');
						
						// Handle Delivery save error
						done(deliverySaveErr);
					});
			});
	});

	it('should be able to update Delivery instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Delivery
				agent.post('/deliveries')
					.send(delivery)
					.expect(200)
					.end(function(deliverySaveErr, deliverySaveRes) {
						// Handle Delivery save error
						if (deliverySaveErr) done(deliverySaveErr);

						// Update Delivery name
						delivery.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Delivery
						agent.put('/deliveries/' + deliverySaveRes.body._id)
							.send(delivery)
							.expect(200)
							.end(function(deliveryUpdateErr, deliveryUpdateRes) {
								// Handle Delivery update error
								if (deliveryUpdateErr) done(deliveryUpdateErr);

								// Set assertions
								(deliveryUpdateRes.body._id).should.equal(deliverySaveRes.body._id);
								(deliveryUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Deliveries if not signed in', function(done) {
		// Create new Delivery model instance
		var deliveryObj = new Delivery(delivery);

		// Save the Delivery
		deliveryObj.save(function() {
			// Request Deliveries
			request(app).get('/deliveries')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Delivery if not signed in', function(done) {
		// Create new Delivery model instance
		var deliveryObj = new Delivery(delivery);

		// Save the Delivery
		deliveryObj.save(function() {
			request(app).get('/deliveries/' + deliveryObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', delivery.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Delivery instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Delivery
				agent.post('/deliveries')
					.send(delivery)
					.expect(200)
					.end(function(deliverySaveErr, deliverySaveRes) {
						// Handle Delivery save error
						if (deliverySaveErr) done(deliverySaveErr);

						// Delete existing Delivery
						agent.delete('/deliveries/' + deliverySaveRes.body._id)
							.send(delivery)
							.expect(200)
							.end(function(deliveryDeleteErr, deliveryDeleteRes) {
								// Handle Delivery error error
								if (deliveryDeleteErr) done(deliveryDeleteErr);

								// Set assertions
								(deliveryDeleteRes.body._id).should.equal(deliverySaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Delivery instance if not signed in', function(done) {
		// Set Delivery user 
		delivery.user = user;

		// Create new Delivery model instance
		var deliveryObj = new Delivery(delivery);

		// Save the Delivery
		deliveryObj.save(function() {
			// Try deleting Delivery
			request(app).delete('/deliveries/' + deliveryObj._id)
			.expect(401)
			.end(function(deliveryDeleteErr, deliveryDeleteRes) {
				// Set message assertion
				(deliveryDeleteRes.body.message).should.match('User is not logged in');

				// Handle Delivery error error
				done(deliveryDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Delivery.remove().exec();
		done();
	});
});