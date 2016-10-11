var mysql = require('../db.js');

var Organisator = function () {
    email = '';
    wachtwoord = '';
};

Organisator.loginUser = function (obj, callback){
    var query ="SELECT count(*) as aantal from `Login` where email = ? and wachtwoord = ?";
    mysql.connection(function (err, conn){
        if(err) {
            return callback(err);
        }
        conn.query(query, [obj.email, obj.wachtwoord], function (err, rows){
            var aantal = rows[0].aantal;
            console.log(aantal);
            //console.log(callback(null, aantal))
            if(err) {
                return callback(err, null);
            }
            if (aantal == 0){
                return callback(null, aantal);
            }
            if (aantal => 0){
                return callback(null, aantal);
            } else {
                console.log("Else: " +rows[0]);
            }
        })
    });
    
};

module.exports = Organisator;