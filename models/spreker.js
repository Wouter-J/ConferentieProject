/*voorbeeld Mail.newMail = function (obj, callback) {
    var query = "INSERT INTO `mailinglist` VALUES(?,?,?)";
    mysql.connection(function (err, conn) {
        if (err) {
            return callback(err);
        }
        conn.query(query, [obj.email, obj.voornaam, obj.achternaam], function (err, rows) {
            if (err) {
                return callback(err,null);
            } else{
                return callback(null, rows);
            }
        });
    })
}; */

var mysql = require('../db.js');
var Spreker = function(){
    onderwerp = '';
    wensen = '';
    voorkeurSloten = '';
    toegewezenSloten = '';
    naam = '';
    tussenvoegsel = '';
    achternaam = '';
    email = '';
    rol = '';
    idMaaltijd = '';
}

Spreker.newSpreker = function(obj, callback) {
    var query = "INSERT INTO `spreker` VALUES(NULL,?,?,?)"
};

module.exports = Spreker;