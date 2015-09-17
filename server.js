//requirements
var https = require("https");
var http = require("http");
var dispatcher = require("httpdispatcher");

//variables
var url_status = 'https://status.github.com/api/status.json';
var url_messages = 'https://status.github.com/api/messages.json';
const port = 8080;


//scrapes the target website
var scrap = function(url, name){
  https.get(url, function(response){
        var body = '';

        response.on('data', function(chunk){
          body += chunk;
        });

        response.on('end', function(){
          serve(body, name);
        });
  }).on('error', function(e){
          console.log("Error: ", e);
    });
};

//create the webserver, listen and wait for dispatcher
http.createServer(function(request,response){
  dispatcher.dispatch(request, response);
}).listen(port);

console.log('listening on', port);

//dispatch the scraped website
var serve = function(body, page){
  dispatcher.onGet("/"+page, function(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.writeHeader(200, {"Content-Type": "application/json"});
    res.end(body);
  });

};

//we have a fallback: scrap -> serve(dispatch)
scrap(url_status, "status");
scrap(url_messages, "messages");
