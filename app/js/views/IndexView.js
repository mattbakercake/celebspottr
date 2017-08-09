/**
 *IndexView.js defines the index view (controller)
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'handlebars',
    'text!templates/indextemplate.html',
], function($, _, Backbone, Handlebars, indexTemplate) {
    
    //Index View
    var IndexView = Backbone.View.extend({

        el: '#app-content', //DOM element to attach view to
        compiledTemplate: null, //compiled html view template

        events: {
            'change #file' : 'readFile' //file chosen
        },

        /**
         * Constructor
         */
        initialize: function() {
            var template = Handlebars.compile(indexTemplate) //compile html template
            var context = {name:"Matt"}

            this.compiledTemplate = template(context) //add variables to view template
        },
        
        /**
         * Display view template
         */
        render: function() {
            this.$el.html(this.compiledTemplate); // push template content to DOM element
        },

        /**
         * Image has been chosen handle it
         */
        readFile: function(e) {
            var file = e.target.files[0]; //selecting a single file

            var reader = new FileReader(); // Read in the image file as a data URL.
            reader.readAsDataURL(file);

            //have read file and have image blob
            reader.onload = function(event) { 
                console.log(event.target.result);
            };
        }

    });
    
    return IndexView; //return the view object
});