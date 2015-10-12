'use strict';

(function() {
	// Innings Controller Spec
	describe('Innings Controller Tests', function() {
		// Initialize global variables
		var InningsController,
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

			// Initialize the Innings controller.
			InningsController = $controller('InningsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Inning object fetched from XHR', inject(function(Innings) {
			// Create sample Inning using the Innings service
			var sampleInning = new Innings({
				name: 'New Inning'
			});

			// Create a sample Innings array that includes the new Inning
			var sampleInnings = [sampleInning];

			// Set GET response
			$httpBackend.expectGET('innings').respond(sampleInnings);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.innings).toEqualData(sampleInnings);
		}));

		it('$scope.findOne() should create an array with one Inning object fetched from XHR using a inningId URL parameter', inject(function(Innings) {
			// Define a sample Inning object
			var sampleInning = new Innings({
				name: 'New Inning'
			});

			// Set the URL parameter
			$stateParams.inningId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/innings\/([0-9a-fA-F]{24})$/).respond(sampleInning);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.inning).toEqualData(sampleInning);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Innings) {
			// Create a sample Inning object
			var sampleInningPostData = new Innings({
				name: 'New Inning'
			});

			// Create a sample Inning response
			var sampleInningResponse = new Innings({
				_id: '525cf20451979dea2c000001',
				name: 'New Inning'
			});

			// Fixture mock form input values
			scope.name = 'New Inning';

			// Set POST response
			$httpBackend.expectPOST('innings', sampleInningPostData).respond(sampleInningResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Inning was created
			expect($location.path()).toBe('/innings/' + sampleInningResponse._id);
		}));

		it('$scope.update() should update a valid Inning', inject(function(Innings) {
			// Define a sample Inning put data
			var sampleInningPutData = new Innings({
				_id: '525cf20451979dea2c000001',
				name: 'New Inning'
			});

			// Mock Inning in scope
			scope.inning = sampleInningPutData;

			// Set PUT response
			$httpBackend.expectPUT(/innings\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/innings/' + sampleInningPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid inningId and remove the Inning from the scope', inject(function(Innings) {
			// Create new Inning object
			var sampleInning = new Innings({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Innings array and include the Inning
			scope.innings = [sampleInning];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/innings\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleInning);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.innings.length).toBe(0);
		}));
	});
}());