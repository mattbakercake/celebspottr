### Libraries Used ###
* **backbone.js** - Allows separation of project structure (MVP/C stylee), request routing and RESTful JSON interface to API's
* **underscore.js** - Dependency of backbone.js. utility function library that among other things can be used for output templating
* **require.js** - file and module loader allows views. models etc to be split out into multiple files.  Optimiser available to minify source into a single file for production
* **text** - AMD loader plugin allows html templates to be loaded into views
* **handlebars** - html/js templating engine
* **jQuery** - the best known javascript library!
### Application Structure ###

    
    |--app
    |   |--css
    |   |--js
    |   |   |--collections
    |   |   |--models
    |   |   |--vendor
    |   |   |--views
    |   |   |--router.js
    |   |   
    |   |--templates
    |   |--bootstrap.js
    |
    |--index.html
    
The app is a "Single Page" structure, i.e requests arrive via index.html and a 
router decides how the request should be handled.

* **index.html** - application landing page.  Defines basic HTML5 page structure, includes stylesheets, bootstraps the application and calls require.js to handle file dependencies.
* **bootstrap.js** - defines common path shortcuts for require.js and initialises the backbone.js router
* **router.js** - Defines application routes and functions to initialise views
* **templates**(DIR) - html templates that can be rendered by a view(presenter/controller) are stored here
* **js/views**(DIR) - views(presenters/controllers) are stored here. Pascal case is used for the filename suffixed with the word "View" (e.g. ListUsersView.js)
* **js/models**(DIR) - Models are stored here. Pascal case is used for the filename suffixed with the word "Model" (e.g. UserModel.js)
* **js/collections**(DIR) - Collections are stored here. Using a plural noun, Pascal case is used for the filename suffixed with the word "Collection" (e.g. UsersCollection.js)
* **js/vendor**(DIR) - Third party javascript libraries are stored here.

### Application Flow ###

The backbone.js router uses hash urls to serve views e.g. http://localhost/#/someview

Request hits index.html, which bootstraps the app to initialise it.  The router interprets the
hash url to see if it has a matching route, and if so it calls a function that should 
instantiate a view, and render it if necessary.  Appropriate models or collections can be
instantiated from the view(presenter/controller).

### Creating a View ###

Place view(presenter/controller) scripts in the **js/views** directory.  Use Pascal case for the filename and 
backbone view object, suffixed with the word "View":

example UserView.js

    define([
        /* array of dependency names */
    ], function(/* dependency function arguments */) {
        
        var UserView = Backbone.View.extend({ /* create view object by extending backbone */
            /* view object properties & functions here */
        });
    
        return UserView; /* return view object */
    });

### Creating a Model ###

Place model scripts in the **js/models** directory.  Use Pascal case for the filename and 
backbone model object, suffixed with the word "Model":

example UserModel.js

    define([
        /* array of dependency names */
    ], function(/* dependency function arguments */) {
        
        var UserModel = Backbone.Model.extend({ /* create model object by extending backbone */
            /* model object properties & functions here */
        });
    
        return UserModel; /* return model object */
    });    

### Creating a Collection ###

Place collection scripts in the **js/collections** directory.  Use a plural noun and Pascal case for the filename and 
backbone collection object, suffixed with the word "Collection":

example UsersCollection.js

    define([
        /* array of dependency names */
    ], function(/* dependency function arguments */) {
        
        var UsersCollection = Backbone.Collection.extend({ /* create collection object by extending backbone */
            /* collection object properties & functions here */
        });
    
        return UsersCollection; /* return collection object */
    });    