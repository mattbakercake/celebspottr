/*
 * PeopleCollection.js defines an example collection
 */
define([
   'backbone',
   'sha256',
   'hmacsha256',
   'cryptosha256'
], function (Backbone,SHA256,HMACSHA256,CryptoSHA256) {
    /*
     *PeopleCollection returns AWS Rekognition analysis results
     */
    var PeopleCollection = Backbone.Collection.extend({

        secretAccessKey: 'hS0zzrCf44FoHuadiqPh1yy7KfjUNcBITFFz9D97',

        credential: 'AKIAIDSUQZIIO2CEKFJQ',
        
        url: 'https://rekognition.us-west-2.amazonaws.com', //API endpoint

        oSync: Backbone.sync, //Backbone sync method

        /**
         *  Override sync method in collection so that we
         *  can send necessary custom headers with request
         */
        sync: function(method, model, options) {
console.log(this)
            options || (options = {});

            var date = new Date();
            var isoString = date.toISOString().replace(/[-:]+|\.\d{3}/g,''); //ISO 8601 date string with no milliseconds or punctuation
            var month = (date.getUTCMonth() + 1) < 10 ? '0' + (date.getUTCMonth() +1) : (date.getUTCMonth() + 1); //format month 01-12
            var day = date.getUTCDate() < 10 ? '0' + date.getUTCDate() : date.getUTCDate(); //format day 01-31
            var dateAuthString = String(date.getUTCFullYear()) + String(month) + String(day); //date string required for auth header

             var headers = {
                "content-length" : '',
                "content-type" : "application/x-amz-json-1.1", 
                "host" : 'rekognition.us-west-2.amazonaws.com',
                "x-amz-date" : isoString,   
                "x-amz-target" : "RekognitionService.RecognizeCelebrities"
            }

            var AWSV4Sig = this.calculateAWSSig(headers,isoString,dateAuthString);

            headers['Authorization'] = 'AWS4-HMAC-SHA256 Credential=AKIAIDSUQZIIO2CEKFJQ/' + dateAuthString + '/us-west-2/rekognition/aws4_request, SignedHeaders=content-length;content-type;host;x-amz-date;x-amz-target, Signature=' + AWSV4Sig
console.log(headers)
            options.headers = headers;
            return this.oSync(method,model,options);
        },

        calculateAWSSig: function(headers, isoString, dateAuthString) {

            var http_method = 'GET' + '\n';
            var canonical_uri = '/' + '\n';
            var canonical_qs = '' + '\n';
            var canonical_headers = this.AWSSigCanonicalHeaders(headers) + '\n';
            var signed_headers = 'content-length;content-type;host;x-amz-date;x-amz-target' + '\n';
            var request_payload = CryptoJS.SHA256('').toString(CryptoJS.enc.Hex);

            var canonical_request = http_method + canonical_uri + canonical_qs + canonical_headers + signed_headers + request_payload;

            var stringToSign = 'AWS4-HMAC-SHA256' + '\n' + isoString + '\n' + dateAuthString + "/us-west-2/rekognition/aws4_request"  + '\n' + CryptoJS.SHA256(canonical_request).toString(CryptoJS.enc.Hex);

            var dateKey = CryptoJS.HmacSHA256(dateAuthString,'AWS4'+this.secretAccessKey);
            var dateRegionKey = CryptoJS.HmacSHA256('us-west-2',dateKey);
            var dateRegionServiceKey = CryptoJS.HmacSHA256("rekognition",dateRegionKey);
            var signingKey = CryptoJS.HmacSHA256("aws4_request",dateRegionServiceKey);

            var signature = CryptoJS.HmacSHA256(signingKey,stringToSign).toString(CryptoJS.enc.Hex);

console.log('canonical_request')
console.log(canonical_request)

console.log('string_to_sign')
console.log(stringToSign)

console.log('signature')
console.log(signature)

            return signature;
        },

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

