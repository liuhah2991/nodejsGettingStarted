const http = require('http');
const fs = require('fs');
const template = require('art-template');
template.defaults.root = './';
/**新建http服务对象，并编写 处理http请求的 逻辑代码
 * 
**/
var server = http.createServer((req, res) => {
    var path = '.' + req.url;
    console.log(path);
    fs.stat(path, (err, stat) => {
        if (err) {
            console.log('File or dir ' + path + " not exist!");
        } else if (stat.isDirectory()) {
            fs.readdir(path, 'utf-8', (err, files) => {
                if (err) {
                    console.log(err);
                } else {
                    var fileInfoArr = new Array();
                    for (var i = 0; i < files.length; i++) {
                        fileInfoArr[i] = {};
                        var count = 0;
                        (function (i) {
                            fs.stat(path + files[i], (err, stat) => {
                                count++;
                                if (!stat.isDirectory()) {
                                    var typeArr = files[i].split('.');
                                    var type = typeArr[typeArr.length - 1];
                                    if (type == "png" || type == "jpg") {
                                        fileInfoArr[i].type = "pic";
                                    } else {
                                        fileInfoArr[i].type = "text";
                                    }
                                } else {
                                    fileInfoArr[i].type = "dir";
                                }

                                fileInfoArr[i].name = files[i];
                                fileInfoArr[i].size = stat.size;
                                fileInfoArr[i].mtime = stat.mtime;

                                if (count == files.length) {
                                    //console.log(fileInfoArr);
                                    var htmls = template('./index.html',{
                                        data:fileInfoArr
                                    });

                                    res.end(htmls);
                                }
                            });
                        })(i);
                    }
                }
            });
        } else {
            fs.readFile(path, (err, file) => {
                if (err) {
                    console.log(err);
                } else {
                    res.end(file);
                }
            });
        }
    });
});

//http服务对象绑定端口监听
server.listen(9000, () => {
    console.log("http:127.0.0.1:9000/");
});