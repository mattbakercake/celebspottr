/**
 *IndexView.js defines the index view (controller)
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'handlebars',
    'js/collections/PeopleCollection',
    'text!templates/indextemplate.html',
], function($, _, Backbone, Handlebars, PeopleCollection, indexTemplate) {
    
    var IndexView = Backbone.View.extend({

        el: '#app-content', //DOM element to attach view to

        compiledTemplate: null, //compiled html view template

        people: {}, //collection of people detected in image

        imageURI: null, //base64 image uri

        imageBlob: null, //just the image data blob

        events: {
            'change #file' : 'readFile' //file chosen
        },

        /**
         * Constructor
         */
        initialize: function() {
            this.render();
        },
        
        /**
         * Display view template
         */
        render: function() {

            var context = {
                people: this.people.models
            }
            var template = Handlebars.compile(indexTemplate) //compile html template
            this.compiledTemplate = template(context) //add variables to view template

            this.$el.html(this.compiledTemplate); // push template content to DOM element

            this.renderImage();
        },

        /**
         * Image has been chosen from file chooser - handle it
         */
        readFile: function(e) {
            var file = e.target.files[0]; //selecting a single file

            // Read in the image file as a data URL.
            var reader = new FileReader(); 
            reader.readAsDataURL(file);

            reader.onload = $.proxy(function(event) { //file is read and have image blob

                this.imageURI = event.target.result; //full image uri
                this.imageBlob = event.target.result.split(',')[1] //image binary meta data removed
                this.analyseImage(); //process image

            },this);
        },

        /**
         *  Get people in image
         */
        analyseImage: function() {

            //photo analysis will create a collection of people
            this.people = new PeopleCollection();

            //listen for collection update to re-render page
            this.listenTo(this.people, "update", this.render);

            //fetch collection (calls API)
            this.people.fetch({
                data: JSON.stringify({ Image : { Bytes: this.imageBlob }})
            });
        },

        /**
         * Draw selected image scaled on canvas
         */
         renderImage: function() {

            var img = new Image();
            img.src = this.imageURI;

            var canvas = document.getElementById('image-canvas');
            var ctx = canvas.getContext('2d');
                
            img.onload = function() {
                var ratio = img.width / img.height;
                var newWidth = img.width > canvas.width ? canvas.width : img.width;
                var newHeight = newWidth / ratio;
                if (newHeight > canvas.height) {
                     newHeight = canvas.height;
                     newWidth = newHeight * ratio;
                 }
                
                ctx.drawImage(img,0,0, newWidth , newHeight);
            }

         }

    });
    
    return IndexView; //return the view object
});