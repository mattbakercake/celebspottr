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

        imgWidth: null, //scaled image width (needed for boundingbox creation)

        imgHeight: null, //scaled image height (needed for boundingbox creation)

        scaledCanvasImg: null, //canvas image before bounding boxes


        events: {
            'click input' : 'closePopover', //file button clicked
            'change #file' : 'readFile', //file chosen
            'click [type="checkbox"]' : 'redrawBoundingBoxes' //checkbox changed
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

            var context = { //variables to send to template
                people: this.people.models
            }

            var template = Handlebars.compile(indexTemplate) //compile html template
            this.compiledTemplate = template(context) //add variables to view template

            this.$el.html(this.compiledTemplate); // push template content to DOM element

            this.renderImage();

            this.hideLoading(); //hide loading screen if visible;

            $('#file').popover('show');
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
         *  Get people in image from Rekognition API
         */
        analyseImage: function() {

            //photo analysis will create a collection of people
            this.people = new PeopleCollection();

            //listen for collection update after API call to re-render page
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

            //create an image object from the data
            var img = new Image();
            img.src = this.imageURI;

            //initialise canvas element
            var canvas = document.getElementById('image-canvas');
            var ctx = canvas.getContext('2d');
            
            //when image data loaded scale the image
            img.onload = $.proxy(function() {
                var ratio = img.width / img.height;
                this.imgWidth = img.width > canvas.width ? canvas.width : img.width;
                this.imgHeight = this.imgWidth / ratio;
                if (this.imgHeight > canvas.height) {
                     this.imgHeight = canvas.height;
                     this.imgWidth = this.imgHeight * ratio;
                 }
                
                ctx.drawImage(img,0,0, this.imgWidth , this.imgHeight); //draw image to canvas

                this.scaledCanvasImg = ctx.getImageData(0,0,canvas.width,canvas.height); //save canvas image data to reset later

                $.each(this.people.models, $.proxy(function(index,person){ //for each person draw bounding box around face
                    this.drawImageBoundingBox(person);
                },this));
                
            },this);

         },


        /**
        * Draw bounding box on image
        */
        drawImageBoundingBox: function(person) {

            if (person.get('Name') !== null) {
                var params = person.get('Face').BoundingBox; //celebrity
            } else {
                var params = person.get('BoundingBox'); //unrecognised
            }
            var colour = person.get('highlightColour')

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
         *  redraw bounding boxes on image (e.g. person de-selected)
         */
        redrawBoundingBoxes: function() {

            //reset canvas to clean image
            var canvas = document.getElementById('image-canvas');
            var ctx = canvas.getContext('2d');
            ctx.putImageData(this.scaledCanvasImg,0,0);

            //draw boudning box for each person who is selected
            $.each($('[type="checkbox"]'), $.proxy(function(index,checkbox) {
                if ($(checkbox).is(':checked')) {
                    var person = this.people.get({cid:$(checkbox).data('id')});
                    this.drawImageBoundingBox(person);
                } 
            },this));

        },


        /**
         *  Close get started popover
         */
        closePopover: function() {
            $('#file').popover('close')
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