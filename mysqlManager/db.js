const mysql = require('mysql');

const option = {
    host: "127.0.0.1",
    user: "root",
    password: "123.com",
    database: "test",
};

var connection = mysql.createConnection(option);

module.exports.query = (callback) => {
    connection.connect();
    connection.query("select * from nodejstest", (err, data, field) => {
        if (err) {
            console.log(err);
        } else {
            callback(data);
        }
        connection.end();
    })
}