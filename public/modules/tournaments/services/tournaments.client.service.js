'use strict';

//Tournaments service used to communicate Tournaments REST endpoints
angular.module('tournaments').factory('Tournaments', ['$resource',
    function($resource) {
        return $resource('tournaments/:tournamentId', { tournamentId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);