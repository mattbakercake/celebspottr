/**
 * PersonModel.js defines an person model
 */
define([
   'backbone'
], function (Backbone) {
    var Person = Backbone.Model.extend({
    	
    	defaults: {
    		id: null,
			MatchConfidence: null,
			name: null
		}

    });
    
    return Person; //return require.js User object definition
});



