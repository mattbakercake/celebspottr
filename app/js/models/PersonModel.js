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

      //set default attributes for a person
      defaults: {
        Id: null,
        MatchConfidence: null,
        Name: null,
        Url: null,
        highlightColour: null,
      },

      initialize: function() {
        this.set({highlightColour: RandomColor()}); //set a random highlight colour for instance of person
      },

    });
    
    return Person; //return require.js Person object definition
});



