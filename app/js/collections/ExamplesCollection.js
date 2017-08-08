/*
 * ExampleCollection.js defines an example collection
 */
define([
   'backbone',
   'js/models/ExampleModel'
], function (Backbone, Example) {
    /*
     * ExampleCollection object defined here
     */
    var ExamplesCollection = Backbone.Collection.extend({
        model: Example
        /* define collection here*/
    });
    
    return ExamplesCollection; /* return require.js Users object definition */
});

