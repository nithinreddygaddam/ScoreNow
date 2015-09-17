'use strict';

// Configuring the Articles module
angular.module('tournaments').run(['Menus',
    function(Menus) {
        // Set top bar menu items
        Menus.addMenuItem('topbar', 'Tournaments', 'tournaments', 'dropdown', '/tournaments(/create)?');
        Menus.addSubMenuItem('topbar', 'tournaments', 'List Tournaments', 'tournaments');
        Menus.addSubMenuItem('topbar', 'tournaments', 'New Tournament', 'tournaments/create');
    }
]);