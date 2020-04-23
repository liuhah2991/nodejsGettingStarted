const http = require('http');
const fs = require('fs');
const moment = require('moment');
const template = require('art-template');
template.defaults.root = './';


//新建http服务对象，并编写 处理http请求的 逻辑代码
var server = http.createServer((req, res) => {
    var path = '.' + req.url;
    //console.log(path);

    /**
     * 处理第一步：判断获取请求文件的信息，并判断是否存在，且是否是目录
     * 注意在nodejs中，并不推荐在操作文件之前通过fs.exists()对文件存在性进行检查，
     * 而是应该直接读取，然后将文件不存在的异常放在 回调函数err中进行处理
    */
    fs.stat(path, (err, stat) => {
        //分支1.1，文件信息获取失败，直接输出文件不存在提示
        if (err) {
            console.log('File or dir ' + path + " not exist!");
        }
        //分支1.2，请求为目录，则遍历该目录中所有子目录信息，填充文件信息列表
        else if (stat.isDirectory()) {
            //处理第二步，获取该目录下所有子文件（夹）名称的数组 files
            fs.readdir(path, 'utf-8', (err, files) => {
                if (err) {
                    console.log(err);
                } else {
                    //处理第三步，通过文件名数组，遍历子文件（夹）
                    var fileInfoArr = new Array();
                    for (var i = 0; i < files.length; i++) {
                        fileInfoArr[i] = {};
                        /**
                         * 读取各子文件信息在异步回调中完成，进度不统一
                         * 直接以变量i 作为计数单位，很可能有些信息还未读取完成就返回了
                         * 所以增加一个计数变量count
                        */
                        var count = 0;
                        //引入闭包，解决执行回调函数时，变量i已非原始值的问题
                        (function (i) {
                            //处理第四步，获取子文件（夹）的信息，并填充数组 fileInfoArr
                            fs.stat(path + files[i], (err, stat) => {
                                //判断子文件类型
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

                                //获取子文件名称、大小和修改时间信息，注意名称在files数组中，stat中是没有的
                                fileInfoArr[i].name = files[i];
                                fileInfoArr[i].size = stat.size;
                                //使用moment插件，将修改时间信息格式化为方便阅读的格式
                                fileInfoArr[i].mtime = moment(stat.mtime).format('YYYY-MM-DD hh:mm:ss');

                                //计数器自增，并判断是否已经完成了所有子文件信息的读取
                                count++;
                                if (count == files.length) {
                                    //使用html模版引擎插件art-template，
                                    //将获取到的信息数据直接填充到html中，实现服务器端渲染，然后传回客户端
                                    var htmls = template('./index.html', {
                                        data: fileInfoArr
                                    });
                                    res.end(htmls);
                                }
                            });
                        })(i);
                        //闭包调用结束
                    }
                }
            });
        }
        //分支1.3，此Demo种，非目录格式的请求一般是请求的图片资源，可以用fs.readFile()读取后直接返回
        else {
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
    console.log("http://127.0.0.1:9000");
});