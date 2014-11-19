var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs")
    port = process.argv[2] || 8888;
 
// add timestamp in appcache to force reload of app in web browser.
fs.readFile('offline.appcache', 'utf8', function (err,data) {
   if (err) { return console.log(err);}
   var timestamp = new Date().toISOString();
   var result = data.replace(/\[[^\]]+\]/m, '[' + timestamp + ']');
   fs.writeFile('offline.appcache', result, 'utf8', function (err) {
      if (err) return console.log(err);
   });
});
 
http.createServer(function(request, response) {

      console.log(request.url);
 
  var uri = url.parse(request.url).pathname
    , filename = path.join(process.cwd(), uri);
  
  fs.exists(filename, function(exists) {
    if(!exists) {

      response.writeHead(404, {"Content-Type": "text/plain"});
      response.write("404 Not Found\n");
      response.end();
      return;
    }
 
    if (fs.statSync(filename).isDirectory()) filename += '/index.html';
 
    fs.readFile(filename, "binary", function(err, file) {
      if(err) {        
        response.writeHead(500, {"Content-Type": "text/plain"});
        response.write(err + "\n");
        response.end();
        return;
      }
 
      var contentType = {"Content-Type": "text/plain"};
      if (/\.js$/.test(filename)) {
         contentType = {"Content-Type": "application/javascript"};
      }
      if (/\.css$/.test(filename)) {
         contentType = {"Content-Type": "text/css"};
      }
      if (/\.html$/.test(filename)) {
         contentType = {"Content-Type": "text/html"};
      }
      if (/\.appcache$/.test(filename)) {
         contentType = {"Content-Type": "text/cache-manifest"};
      }	  
      response.writeHead(200, contentType);
      response.write(file, "binary");
      response.end();
    });
  });
}).listen(parseInt(port, 10));
 
console.log("Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");

