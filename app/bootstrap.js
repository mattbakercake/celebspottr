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
        hmacsha256: 'js/vendor/hmac-sha256',
        cryptosha256: 'js/vendor/cryptosha256',
        randomcolor: 'js/vendor/randomcolor-min'
    },
    shim: {
            "js/vendor/bootstrap.min": { //bootstrap js not amd - define dependencies
                deps: ["jquery"],
            }
    },

});


require(['./application-config','js/vendor/bootstrap.min'], function(){ //globally include config file and bootstrapjs
    require(['router'], function(Router) { //fire up router to start app
        Router.initialize();        
    });
});


