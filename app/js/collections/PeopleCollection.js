/*
 * PeopleCollection.js defines an example collection
 */
define([
   'backbone',
   'hmacsha256',
   'cryptosha256',
   'js/models/PersonModel'
], function (Backbone,HMACSHA256,CryptoSHA256,PersonModel) {
    /*
     *PeopleCollection returns AWS Rekognition analysis results
     */
    var PeopleCollection = Backbone.Collection.extend({

        model: PersonModel,

        secretAccessKey: Config.AWS.SecretAccessKey,

        credential: Config.AWS.Credential,
        
        url: 'https://rekognition.us-west-2.amazonaws.com', //API endpoint

        oSync: Backbone.sync, //Backbone sync method

        /**
         *  Override fetch method in collection so that we
         *  can send necessary custom headers with AWS API request
         */
         fetch: function(options) {

            //date strings required for API headers/request signing
            var date = new Date();
            var isoString = date.toISOString().replace(/[-:]+|\.\d{3}/g,''); //ISO 8601 date string with no milliseconds or punctuation
            var month = (date.getUTCMonth() + 1) < 10 ? '0' + (date.getUTCMonth() +1) : (date.getUTCMonth() + 1); //format month 01-12
            var day = date.getUTCDate() < 10 ? '0' + date.getUTCDate() : date.getUTCDate(); //format day 01-31
            var dateAuthString = String(date.getUTCFullYear()) + String(month) + String(day); //date string required for auth header

            //define custom headers
             var headers = {
                "content-length" : options.data.length,
                "content-type" : "application/x-amz-json-1.1", 
                "host" : 'rekognition.us-west-2.amazonaws.com',
                "x-amz-date" : isoString,   
                "x-amz-target" : "RekognitionService.RecognizeCelebrities"
            }

            var AWSV4Sig = this.calculateAWSSig(headers,isoString,dateAuthString,options.data); //AWS V4 signature

            headers['Authorization'] = 'AWS4-HMAC-SHA256 Credential=' + this.credential +'/' + dateAuthString + '/us-west-2/rekognition/aws4_request, SignedHeaders=content-length;content-type;host;x-amz-date;x-amz-target, Signature=' + AWSV4Sig

            //JQuery ajax call with ustom headers and payload
            $.ajax({
                url: this.url,
                method: "POST",
                dataType: "json",
                contentType: "application/json",
                data: options.data,
                headers: headers,
                success: $.proxy(function(data,response){
                    this.fetchSuccess(data)
                },this)
            });
        },


        /**
         *  Parses returned API data to add models to collection
         *  on successful fetch
         */
        fetchSuccess: function(data,response) {

            var people = data.CelebrityFaces.concat(data.UnrecognizedFaces); //joining celebrities and unrecognised people

            //create a person model for each celebrity/unrecognised person detected
             $.each(people, $.proxy(function (index,details) {
                var person = new PersonModel(details);
                this.add(person);
             },this));

             this.trigger('fetchComplete')
        },

        /**
         *  Function calculates AWS V4 signature required for signing
         *  API request headers
         */
        calculateAWSSig: function(headers, isoString, dateAuthString,payload) {

            //building canonical request string
            var http_method = 'POST' + '\n';
            var canonical_uri = '/' + '\n';
            var canonical_qs = '' + '\n';
            var canonical_headers = this.AWSSigCanonicalHeaders(headers) + '\n';
            var signed_headers = 'content-length;content-type;host;x-amz-date;x-amz-target' + '\n';
            var request_payload = CryptoJS.SHA256(payload).toString(CryptoJS.enc.Hex);

            var canonical_request = http_method + canonical_uri + canonical_qs + canonical_headers + signed_headers + request_payload;

            //building string-to-sign string using canonical request string
            var stringToSign = 'AWS4-HMAC-SHA256' + '\n' + isoString + '\n' + dateAuthString + "/us-west-2/rekognition/aws4_request"  + '\n' + CryptoJS.SHA256(canonical_request).toString();

            //building signing key
            var dateKey = CryptoJS.HmacSHA256(dateAuthString,'AWS4'+this.secretAccessKey);
            var dateRegionKey = CryptoJS.HmacSHA256('us-west-2',dateKey);
            var dateRegionServiceKey = CryptoJS.HmacSHA256("rekognition",dateRegionKey);
            var signingKey = CryptoJS.HmacSHA256("aws4_request",dateRegionServiceKey);

            //create signature using string-to-sign and signing key
            var signature = CryptoJS.HmacSHA256(stringToSign,signingKey);

            return signature;
        },

        /**
         *  Function formats headers object into canonical headers
         *  string required to build AWS V4 Signature
         *  e.g. 'content-type : application/x-amz-json-1.1 \n'
         */
        AWSSigCanonicalHeaders: function(headers) {

            var headerString = '';

            var count = 0;
            $.each(headers, function(header, value) {
                count++;
                headerString += encodeURI(header) + ":" + encodeURI(value) + '\n';
            });

            return headerString;
        }

    });
    
    return PeopleCollection; /* return require.js Users object definition */
});

