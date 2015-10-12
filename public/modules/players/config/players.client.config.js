'use strict';

// Configuring the Articles module
angular.module('players').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Players', 'players', 'dropdown', '/players(/create)?');
		Menus.addSubMenuItem('topbar', 'players', 'List Players', 'players');
		Menus.addSubMenuItem('topbar', 'players', 'New Player', 'players/create');
	}
]);