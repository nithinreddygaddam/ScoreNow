'use strict';

(function() {
	// Matches Controller Spec
	describe('Matches Controller Tests', function() {
		// Initialize global variables
		var MatchesController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Matches controller.
			MatchesController = $controller('MatchesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Match object fetched from XHR', inject(function(Matches) {
			// Create sample Match using the Matches service
			var sampleMatch = new Matches({
				name: 'New Match'
			});

			// Create a sample Matches array that includes the new Match
			var sampleMatches = [sampleMatch];

			// Set GET response
			$httpBackend.expectGET('matches').respond(sampleMatches);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.matches).toEqualData(sampleMatches);
		}));

		it('$scope.findOne() should create an array with one Match object fetched from XHR using a matchId URL parameter', inject(function(Matches) {
			// Define a sample Match object
			var sampleMatch = new Matches({
				name: 'New Match'
			});

			// Set the URL parameter
			$stateParams.matchId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/matches\/([0-9a-fA-F]{24})$/).respond(sampleMatch);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.match).toEqualData(sampleMatch);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Matches) {
			// Create a sample Match object
			var sampleMatchPostData = new Matches({
				name: 'New Match'
			});

			// Create a sample Match response
			var sampleMatchResponse = new Matches({
				_id: '525cf20451979dea2c000001',
				name: 'New Match'
			});

			// Fixture mock form input values
			scope.name = 'New Match';

			// Set POST response
			$httpBackend.expectPOST('matches', sampleMatchPostData).respond(sampleMatchResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Match was created
			expect($location.path()).toBe('/matches/' + sampleMatchResponse._id);
		}));

		it('$scope.update() should update a valid Match', inject(function(Matches) {
			// Define a sample Match put data
			var sampleMatchPutData = new Matches({
				_id: '525cf20451979dea2c000001',
				name: 'New Match'
			});

			// Mock Match in scope
			scope.match = sampleMatchPutData;

			// Set PUT response
			$httpBackend.expectPUT(/matches\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/matches/' + sampleMatchPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid matchId and remove the Match from the scope', inject(function(Matches) {
			// Create new Match object
			var sampleMatch = new Matches({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Matches array and include the Match
			scope.matches = [sampleMatch];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/matches\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleMatch);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.matches.length).toBe(0);
		}));
	});
}());