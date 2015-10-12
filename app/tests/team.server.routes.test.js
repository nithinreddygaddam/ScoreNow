'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Team = mongoose.model('Team'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, team;

/**
 * Team routes tests
 */
describe('Team CRUD tests', function() {
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

		// Save a user to the test db and create new Team
		user.save(function() {
			team = {
				name: 'Team Name'
			};

			done();
		});
	});

	it('should be able to save Team instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Team
				agent.post('/teams')
					.send(team)
					.expect(200)
					.end(function(teamSaveErr, teamSaveRes) {
						// Handle Team save error
						if (teamSaveErr) done(teamSaveErr);

						// Get a list of Teams
						agent.get('/teams')
							.end(function(teamsGetErr, teamsGetRes) {
								// Handle Team save error
								if (teamsGetErr) done(teamsGetErr);

								// Get Teams list
								var teams = teamsGetRes.body;

								// Set assertions
								(teams[0].user._id).should.equal(userId);
								(teams[0].name).should.match('Team Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Team instance if not logged in', function(done) {
		agent.post('/teams')
			.send(team)
			.expect(401)
			.end(function(teamSaveErr, teamSaveRes) {
				// Call the assertion callback
				done(teamSaveErr);
			});
	});

	it('should not be able to save Team instance if no name is provided', function(done) {
		// Invalidate name field
		team.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Team
				agent.post('/teams')
					.send(team)
					.expect(400)
					.end(function(teamSaveErr, teamSaveRes) {
						// Set message assertion
						(teamSaveRes.body.message).should.match('Please fill Team name');
						
						// Handle Team save error
						done(teamSaveErr);
					});
			});
	});

	it('should be able to update Team instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Team
				agent.post('/teams')
					.send(team)
					.expect(200)
					.end(function(teamSaveErr, teamSaveRes) {
						// Handle Team save error
						if (teamSaveErr) done(teamSaveErr);

						// Update Team name
						team.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Team
						agent.put('/teams/' + teamSaveRes.body._id)
							.send(team)
							.expect(200)
							.end(function(teamUpdateErr, teamUpdateRes) {
								// Handle Team update error
								if (teamUpdateErr) done(teamUpdateErr);

								// Set assertions
								(teamUpdateRes.body._id).should.equal(teamSaveRes.body._id);
								(teamUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Teams if not signed in', function(done) {
		// Create new Team model instance
		var teamObj = new Team(team);

		// Save the Team
		teamObj.save(function() {
			// Request Teams
			request(app).get('/teams')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Team if not signed in', function(done) {
		// Create new Team model instance
		var teamObj = new Team(team);

		// Save the Team
		teamObj.save(function() {
			request(app).get('/teams/' + teamObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', team.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Team instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Team
				agent.post('/teams')
					.send(team)
					.expect(200)
					.end(function(teamSaveErr, teamSaveRes) {
						// Handle Team save error
						if (teamSaveErr) done(teamSaveErr);

						// Delete existing Team
						agent.delete('/teams/' + teamSaveRes.body._id)
							.send(team)
							.expect(200)
							.end(function(teamDeleteErr, teamDeleteRes) {
								// Handle Team error error
								if (teamDeleteErr) done(teamDeleteErr);

								// Set assertions
								(teamDeleteRes.body._id).should.equal(teamSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Team instance if not signed in', function(done) {
		// Set Team user 
		team.user = user;

		// Create new Team model instance
		var teamObj = new Team(team);

		// Save the Team
		teamObj.save(function() {
			// Try deleting Team
			request(app).delete('/teams/' + teamObj._id)
			.expect(401)
			.end(function(teamDeleteErr, teamDeleteRes) {
				// Set message assertion
				(teamDeleteRes.body.message).should.match('User is not logged in');

				// Handle Team error error
				done(teamDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Team.remove().exec();
		done();
	});
});