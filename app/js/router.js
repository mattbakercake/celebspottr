/**
 * router.js initialises the backbone.js router
 * to resolve requests
 */

define([
    'jquery',
    'backbone',
    'js/views/IndexView'
], function($, Backbone, IndexView) {
    
    /*
     * Define routes using :params and *splats if necessary
     * 'URL': 'function' e.g. 'user/:1': 'getUser' 
     */
    var AppRouter = Backbone.Router.extend({
        routes: {
            '': 'showIndex',
        }  
    });
    
    /*
     * initialise router
     */
    var initialize = function() {
        var route = new AppRouter;  //instantiate router object
        
        
        route.on('route:showIndex', function(){ //indexView route definition
           var indexView = new IndexView();
           indexView.render();
        });

        Backbone.history.start(); //start routing
    };
    

    return {
        initialize: initialize
    };
 
});


