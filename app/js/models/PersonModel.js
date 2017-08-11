/**
 * PersonModel.js defines an person model
 */
define([
   'backbone',
   'hmacsha256',
   'cryptosha256',
   'randomcolor'
], function (Backbone,HMACSHA256,CryptoSHA256,RandomColor) {
    var Person = Backbone.Model.extend({
    	
        url: 'https://rekognition.us-west-2.amazonaws.com', //API endpoint

        secretAccessKey: Config.AWS.SecretAccessKey,

        credential: Config.AWS.Credential,

        defaults: {
    		Id: null,
			MatchConfidence: null,
			Name: null,
            Url: null,
            highlightColour: null,
		},

        initialize: function() {
            this.set({highlightColour: RandomColor()});
        },

    });
    
    return Person; //return require.js User object definition
});



