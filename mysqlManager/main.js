const http = require('http');
const fs = require('fs');
const db = require('./db.js');
const moment = require('moment');
const template = require('art-template');
template.defaults.root = './';

var server = http.createServer((req, res) => {
    if (req.url == '/') {
        res.setHeader("contentType", "text/html;charset=utf-8");
        fs.readFile("./index.html", "utf-8", (err, data) => {
            if (err) {
                console.log(err);
            } else {
                db.query((data) => {
                    for(var i=0,len=data.length;i<len;i++){
                        data[i].birthday = moment(data[i].birthday).format('YYYY-MM-DD');
                    }
                    
                    var htmls = template('./index.html', {
                        data: data
                    })
                    res.end(htmls);
                });
                
            }
        })
    } else {
        fs.readFile('.' + req.url, (err, file) => {
            if (err) {
                console.log(err);
            }
            else {
                res.end(file);
            }
        })
    }

});

server.listen(9000, () => {
    console.log('http://127.0.0.1:9000');
});