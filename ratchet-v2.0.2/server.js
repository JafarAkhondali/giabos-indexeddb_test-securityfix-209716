var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs")
    port = process.argv[2] || 8888;
 
http.createServer(function(request, response) {

      console.log(request.url);
 
  var uri = url.parse(request.url).pathname
    , filename = path.join(process.cwd(), uri);
  
  path.exists(filename, function(exists) {
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
      response.writeHead(200, contentType);
      response.write(file, "binary");
      response.end();
    });
  });
}).listen(parseInt(port, 10));
 
console.log("Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");

