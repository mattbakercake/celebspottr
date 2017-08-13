### CelebSpotter ###
This small app is an example implementation of Amazon's Rekgonition API, which uses machine deep learning to anaylse images for objects, scenes and faces.  The app is also an implemetation of a bootstrap/require.js boilerplate to organise code into an MV* style structure.

Simply choose a jpg/png image (<5mb) and the app will try to pick out faces and name celebrities it recognises, drawing bounding boxes around any hits it makes.  You can show/hide bounding boxes around faces, and if a celebrity has an IMDB entry then you can click on their name to open this in another tab.

To get started you will need an AWS account with credentials allowing access to rekognition (chargeable service).  It is best to try out this demo behind password protection,as you have to put the credentials into the JS app. Simply clone the repository and then fill in the crendentials in app/application-config.js - that's it!

### Libraries Used ###
* **backbone.js** - Allows separation of project structure (MVP/C stylee), request routing and RESTful JSON interface to API's
* **underscore.js** - Dependency of backbone.js. utility function library that among other things can be used for output templating
* **require.js** - file and module loader allows views. models etc to be split out into multiple files.  Optimiser available to minify source into a single file for production
* **text** - AMD loader plugin allows html templates to be loaded into views
* **handlebars** - html/js templating engine
* **jQuery** - the best known javascript library!
* **Bootstrap** - Twitter's bootstrap framework js features
* **crypto sha256 and hmac-256** - cryptographic library allowing creation of hashes for signing requests
* **randomcolor** - returns a random hex colour value

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
    |   |--application-config.js
    |   |--bootstrap.js
    |
    |--index.html
    
The app is a "Single Page" structure, i.e requests arrive via index.html and a 
router decides how the request should be handled.

* **index.html** - application landing page.  Defines basic HTML5 page structure, includes stylesheets, bootstraps the application and calls require.js to handle file dependencies.
* **bootstrap.js** - defines common path shortcuts for require.js and initialises the backbone.js router
* **application-config.js - application wide config variables can be defined here
* **router.js** - Defines application routes and functions to initialise views
* **templates**(DIR) - html templates that can be rendered by a view(presenter/controller) are stored here
* **js/views**(DIR) - views(presenters/controllers) are stored here. Pascal case is used for the filename suffixed with the word "View" (e.g. ListUsersView.js)
* **js/models**(DIR) - Models are stored here. Pascal case is used for the filename suffixed with the word "Model" (e.g. UserModel.js)
* **js/collections**(DIR) - Collections are stored here. Using a plural noun, Pascal case is used for the filename suffixed with the word "Collection" (e.g. UsersCollection.js)
* **js/vendor**(DIR) - Third party javascript libraries are stored here.
