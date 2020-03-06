const http = require('http');
const fs = require('fs');

var server = http.createServer((req, res) => {
    res.setHeader('Content-type', 'text/html;charset=utf-8');
    if (req.url == '/') {
        fs.readFile('index.html', 'utf-8', (err, file) => {
            err && console.log(err);
            res.end(file);
        });
    } 
});

server.listen(9000, () => {
    console.log("http:127.0.0.1:9000");
});