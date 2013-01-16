var http = require('http');
var url = require('url');
var fs = require('fs');
var server = http.createServer(function(request, response){ 
    response.charset = 'utf-8';
	var t = new Date();
	var pathname = url.parse(request.url).pathname;
    var realPath = '.'+pathname;
    if(realPath.length<=2){
        realPath = './my.html';
    }
    fs.exists(realPath, function (exists) {
        if (!exists) {
            response.writeHead(404, {
                'Content-Type': 'text/plain'
            });

            response.write("This request URL " + pathname + " was not found on this server.");
            response.end();
        } else {
            fs.readFile(realPath, "binary", function (err, file) {
                if (err) {
                    response.writeHead(500, {
                        'Content-Type': 'text/plain'
                    });

                    response.end(err);
                } else {
				    if(realPath.indexOf('.js')!=-1){
				    	response.writeHead(200, {'Content-Type': 'text/javascript'});
				    }else if(realPath.indexOf('.css')!=-1){
				    	response.writeHead(200, {'Content-Type': 'text/css'});
					}else if (realPath.indexOf('.html')!=-1) {
				    	response.writeHead(200, {'Content-Type': 'text/html'});
				    }else{
				    	response.writeHead(200, {'Content-Type': 'text/plain'});
				    };
					response.write(file, "binary");
					response.end();
                }
            });
        }
    });
    
    console.log('['+t+']'+pathname);
}); 
server.listen(8080);
console.log("server start up at http://localhost:8080\n");