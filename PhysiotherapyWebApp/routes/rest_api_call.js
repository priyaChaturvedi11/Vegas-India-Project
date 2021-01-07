import { request } from 'https';
/**
 * HOW TO Make an HTTP Call - GET
 */
// options for GET
var optionsget = {
    host : 'http://127.0.0.1/', // here only the domain name
    // (no http/https !)
    port : 30000,
    path : '/api/users', // the rest of the url with parameters if needed
    method : 'GET' // do GET
};

console.info('Options prepared:');
console.info(optionsget);
console.info('Do the GET call');

// do the GET request
var reqGet = request(optionsget, function(res) {
    console.log("statusCode: ", res.statusCode);
    // uncomment it for header details
//  console.log("headers: ", res.headers);


    res.on('data', function(d) {
        console.info('GET result:\n');
        process.stdout.write(d);
        console.info('\n\nCall completed');
    });

});

reqGet.end();
reqGet.on('error', function(e) {
    console.error(e);
});

/**
 * HOW TO Make an HTTP Call - POST
 */
// do a POST request
// create the JSON object
jsonObject = JSON.stringify({
    "message" : "The web of things is approaching, let do some tests to be ready!",
    "name" : "Test message posted with node.js",
    "caption" : "Some tests with node.js",
    "link" : "http://www.api/users.com",
    "description" : "this is a description",
    "picture" : "http://api/users.com/wp-content/uploads/2012/05/logo2.png",
    "actions" : [ {
        "name" : "api/users",
        "link" : "http://www.api/users.com"
    } ]
});

// prepare the header
var postheaders = {
    'Content-Type' : 'application/json',
    'Content-Length' : Buffer.byteLength(jsonObject, 'utf8')
};

// the post options
var optionspost = {
    host : 'http://127.0.0.1:30000/',
    port : 30000,
    path : '/api/users/feed?access_token=your_api_key',
    method : 'POST',
    headers : postheaders
};

console.info('Options prepared:');
console.info(optionspost);
console.info('Do the POST call');

// do the POST call
var reqPost = request(optionspost, function(res) {
    console.log("statusCode: ", res.statusCode);
    // uncomment it for header details
//  console.log("headers: ", res.headers);

    res.on('data', function(d) {
        console.info('POST result:\n');
        process.stdout.write(d);
        console.info('\n\nPOST completed');
    });
});

// write the json data
reqPost.write(jsonObject);
reqPost.end();
reqPost.on('error', function(e) {
    console.error(e);
});

/**
 * Get Message - GET
 */
// options for GET
var optionsgetmsg = {
    host : 'http://127.0.0.1:30000/', // here only the domain name
    // (no http/https !)
    port : 30000,
    path : '/api/users/feed?access_token=you_api_key', // the rest of the url with parameters if needed
    method : 'GET' // do GET
};

console.info('Options prepared:');
console.info(optionsgetmsg);
console.info('Do the GET call');

// do the GET request
var reqGet = request(optionsgetmsg, function(res) {
    console.log("statusCode: ", res.statusCode);
    // uncomment it for header details
//  console.log("headers: ", res.headers);


    res.on('data', function(d) {
        console.info('GET result after POST:\n');
        process.stdout.write(d);
        console.info('\n\nCall completed');
    });

});

reqGet.end();
reqGet.on('error', function(e) {
    console.error(e);
});
export default rest_api_call;