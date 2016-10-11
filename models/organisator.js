var mysql = require('../db.js');

var Organisator = function () {
    email = '';
    wachtwoord = '';
    ticketID = '';
    incheckTijd = '';
    aantalGebruikersBinnen = '';
    email = '';
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

Organisator.getGebruikers = function(callback){
    var query = "SELECT * FROM `Activegebruikers` ORDER BY `incheckTijd` ASC;";
    mysql.connection(function (err, conn) {
        if (err) {
            return callback(err);
        }
        conn.query(query, function (err, rows) {
            if (err) {
                return callback(err);
            }
            var agenda = [];

            for (var i = 0; i < rows.length; i++) {
                agenda.push({
                    "ticketID": rows[i].ticketID,
                    "incheckTijd": rows[i].incheckTijd,
                    "aantalGebruikersBinnen": rows[i].aantalGebruikersBinnen,
                    "email": rows[i].email,
                });
            }
            return callback(null, agenda);
        })
    });
};

module.exports = Organisator;