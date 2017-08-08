/**
 * bootstrap.js is called from index.html and
 * intiates the application
 */

//define common path shortcuts for require.js */
require.config({
    paths: {
        jquery: 'js/vendor/jquery-3.2.1.min',
        underscore: 'js/vendor/underscore1.8.3-min',
        backbone: 'js/vendor/backbone1.3.3-min',
        text: 'js/vendor/text',
        handlebars: 'js/vendor/handlebars',
        router: 'js/router'
    }
});

//fire up router to start app
require(['router'], function(Router) { 
    Router.initialize();        
});


