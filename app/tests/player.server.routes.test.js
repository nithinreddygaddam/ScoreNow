'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Player = mongoose.model('Player'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, player;

/**
 * Player routes tests
 */
describe('Player CRUD tests', function() {
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

		// Save a user to the test db and create new Player
		user.save(function() {
			player = {
				name: 'Player Name'
			};

			done();
		});
	});

	it('should be able to save Player instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Player
				agent.post('/players')
					.send(player)
					.expect(200)
					.end(function(playerSaveErr, playerSaveRes) {
						// Handle Player save error
						if (playerSaveErr) done(playerSaveErr);

						// Get a list of Players
						agent.get('/players')
							.end(function(playersGetErr, playersGetRes) {
								// Handle Player save error
								if (playersGetErr) done(playersGetErr);

								// Get Players list
								var players = playersGetRes.body;

								// Set assertions
								(players[0].user._id).should.equal(userId);
								(players[0].name).should.match('Player Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Player instance if not logged in', function(done) {
		agent.post('/players')
			.send(player)
			.expect(401)
			.end(function(playerSaveErr, playerSaveRes) {
				// Call the assertion callback
				done(playerSaveErr);
			});
	});

	it('should not be able to save Player instance if no name is provided', function(done) {
		// Invalidate name field
		player.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Player
				agent.post('/players')
					.send(player)
					.expect(400)
					.end(function(playerSaveErr, playerSaveRes) {
						// Set message assertion
						(playerSaveRes.body.message).should.match('Please fill Player name');
						
						// Handle Player save error
						done(playerSaveErr);
					});
			});
	});

	it('should be able to update Player instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Player
				agent.post('/players')
					.send(player)
					.expect(200)
					.end(function(playerSaveErr, playerSaveRes) {
						// Handle Player save error
						if (playerSaveErr) done(playerSaveErr);

						// Update Player name
						player.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Player
						agent.put('/players/' + playerSaveRes.body._id)
							.send(player)
							.expect(200)
							.end(function(playerUpdateErr, playerUpdateRes) {
								// Handle Player update error
								if (playerUpdateErr) done(playerUpdateErr);

								// Set assertions
								(playerUpdateRes.body._id).should.equal(playerSaveRes.body._id);
								(playerUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Players if not signed in', function(done) {
		// Create new Player model instance
		var playerObj = new Player(player);

		// Save the Player
		playerObj.save(function() {
			// Request Players
			request(app).get('/players')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Player if not signed in', function(done) {
		// Create new Player model instance
		var playerObj = new Player(player);

		// Save the Player
		playerObj.save(function() {
			request(app).get('/players/' + playerObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', player.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Player instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Player
				agent.post('/players')
					.send(player)
					.expect(200)
					.end(function(playerSaveErr, playerSaveRes) {
						// Handle Player save error
						if (playerSaveErr) done(playerSaveErr);

						// Delete existing Player
						agent.delete('/players/' + playerSaveRes.body._id)
							.send(player)
							.expect(200)
							.end(function(playerDeleteErr, playerDeleteRes) {
								// Handle Player error error
								if (playerDeleteErr) done(playerDeleteErr);

								// Set assertions
								(playerDeleteRes.body._id).should.equal(playerSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Player instance if not signed in', function(done) {
		// Set Player user 
		player.user = user;

		// Create new Player model instance
		var playerObj = new Player(player);

		// Save the Player
		playerObj.save(function() {
			// Try deleting Player
			request(app).delete('/players/' + playerObj._id)
			.expect(401)
			.end(function(playerDeleteErr, playerDeleteRes) {
				// Set message assertion
				(playerDeleteRes.body.message).should.match('User is not logged in');

				// Handle Player error error
				done(playerDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Player.remove().exec();
		done();
	});
});