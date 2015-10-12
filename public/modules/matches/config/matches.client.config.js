'use strict';

// Configuring the Articles module
angular.module('matches').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Matches', 'matches', 'dropdown', '/matches(/create)?');
		Menus.addSubMenuItem('topbar', 'matches', 'List Matches', 'matches');
		Menus.addSubMenuItem('topbar', 'matches', 'New Match', 'matches/create');
	}
]);