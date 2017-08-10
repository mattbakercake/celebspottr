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
        router: 'js/router',
        bootstrap: 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js',
        sha256: 'js/vendor/sha256',
        hmacsha256: 'js/vendor/hmac-sha256',
        cryptosha256: 'js/vendor/cryptosha256',
    },
    shim: {
        /* Set bootstrap dependencies (just jQuery) */
        'bootstrap' : ['jquery']
     }
});


require(['./application-config'], function(){ //globally include config file
    require(['router'], function(Router) { //fire up router to start app
        Router.initialize();        
    });
});

