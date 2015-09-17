'use strict';

// Tournaments controller
angular.module('tournaments').controller('TournamentsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Tournaments',
    function($scope, $stateParams, $location, Authentication, Tournaments) {
        $scope.authentication = Authentication;
        $scope.currentPage = 1;
        $scope.pageSize = 10;
        $scope.offset = 0;

       // Page changed handler
       $scope.pageChanged = function() {
            $scope.offset = ($scope.currentPage - 1) * $scope.pageSize;
       };

        // Create new Tournament
        $scope.create = function() {
            // Create new Tournament object
            var tournament = new Tournaments ({
                name: this.name,
                description: this.description
            });

            // Redirect after save
            tournament.$save(function(response) {
                $location.path('tournaments/' + response._id);

                // Clear form fields
                $scope.name = '';
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Remove existing Tournament
        $scope.remove = function(tournament) {
            if ( tournament ) { 
                tournament.$remove();

                for (var i in $scope.tournaments) {
                    if ($scope.tournaments [i] === tournament) {
                        $scope.tournaments.splice(i, 1);
                    }
                }
            } else {
                $scope.tournament.$remove(function() {
                    $location.path('tournaments');
                });
            }
        };

        // Update existing Tournament
        $scope.update = function() {
            var tournament = $scope.tournament;

            tournament.$update(function() {
                $location.path('tournaments/' + tournament._id);
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find a list of Tournaments
        $scope.find = function() {
            $scope.tournaments = Tournaments.query();
        };

        // Find existing Tournament
        $scope.findOne = function() {
            $scope.tournament = Tournaments.get({ 
                tournamentId: $stateParams.tournamentId
            });
        };

        // Search for a tournament
        $scope.tournamentSearch = function(product) {
            $location.path('tournaments/' + product._id);
        };
    }
]);