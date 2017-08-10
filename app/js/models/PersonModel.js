/**
 * PersonModel.js defines an person model
 */
define([
   'backbone'
], function (Backbone) {
    var Person = Backbone.Model.extend({
    	
    	defaults: {
    		Id: null,
			MatchConfidence: null,
			Name: null
		}

    });
    
    return Person; //return require.js User object definition
});



