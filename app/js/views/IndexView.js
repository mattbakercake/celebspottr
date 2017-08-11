/**
 *IndexView.js defines the index view (controller)
 */
define([
    'bootstrap',
    'jquery',
    'underscore',
    'backbone',
    'handlebars',   
    'js/collections/PeopleCollection',
    'text!templates/indextemplate.html',
], function(bs,$, _, Backbone, Handlebars, PeopleCollection, indexTemplate) {
    
    var IndexView = Backbone.View.extend({

        el: '#app-content', //DOM element to attach view to

        compiledTemplate: null, //compiled html view template

        people: {}, //collection of people detected in image

        imageURI: null, //base64 image uri

        imageBlob: null, //just the image data blob

        imgWidth: null, //scaled image width

        imgHeight: null, //scaled image height

        events: {
            'change #file' : 'readFile', //file chosen
            'click .celebrity' : 'showCelebrityInfo' //celebrity name clicked
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

            this.hideLoading(); //hide loading screen if visible;
        },

        /**
         * Image has been chosen from file chooser - handle it
         */
        readFile: function(e) {

            this.showLoading();

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
                
            img.onload = $.proxy(function() {
                var ratio = img.width / img.height;
                this.imgWidth = img.width > canvas.width ? canvas.width : img.width;
                this.imgHeight = this.imgWidth / ratio;
                if (this.imgHeight > canvas.height) {
                     this.imgHeight = canvas.height;
                     this.imgWidth = this.imgHeight * ratio;
                 }
                
                ctx.drawImage(img,0,0, this.imgWidth , this.imgHeight);

                $.each(this.people.models, $.proxy(function(index,person){

                    if (person.get('Name') !== null) {
                        this.drawImageBoundingBox(person.get('Face').BoundingBox, person.get('highlightColour'));
                    } else {
                        this.drawImageBoundingBox(person.get('BoundingBox'), person.get('highlightColour'));
                    }
                },this));
                
            },this);

         },


         /**
          * Draw bounding box on image
          */
        drawImageBoundingBox: function(params, colour) {

            var strokeColour = colour.substring(1);

            var left = params.Left * this.imgWidth;
            var top = params.Top * this.imgHeight;
            var height = params.Height * this.imgHeight;
            var width = params.Width * this.imgWidth;

            var canvas = document.getElementById('image-canvas');
            var ctx = canvas.getContext('2d');
            ctx.beginPath();
            ctx.rect(left, top, width, height);
            ctx.lineWidth = 3;
            ctx.strokeStyle = colour;
            ctx.stroke();
        },

        /**
         *  
         */
        showCelebrityInfo: function(e) {         
            var celebrity = this.people.findWhere({Id:$(e.currentTarget).data('id')});
            $('[data-id=' + celebrity.get('Id') + ']').append('<a href=' + celebrity.get('Urls')[0] + '>' + celebrity.get('Urls')[0] + '</a>');
        },


        /**
         *  show loading screen
         */
        showLoading: function() {
            if (!$('#loadingDiv').is(':visible')) {
                $('#loadingDiv').show();
            }
        },

        /**
         *  hide loading screen
         */
        hideLoading: function() {
            if ($('#loadingDiv').is(':visible')) {
                $('#loadingDiv').hide();
            } 
        }

    });
    
    return IndexView; //return the view object
});