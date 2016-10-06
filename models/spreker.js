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
    var query = "INSERT INTO `spreker` VALUES(NULL,?,?,?,?,?,?,?,?,?,?)";
    mysql.connection(function (err, conn) {
        if (err) {
            return callback(err);
        }
        conn.query(query, [obj.onderwerp, obj.wensen, obj.rol, obj.maaltijdType, obj.naam, obj.tussenvoegsel, obj.achternaam, obj.email, obj.maaltijdType], function (err, rows) {
            if (err) {
                return callback(err,null);
            } else{
                return callback(null, rows);
            }
        });
    })
};

module.exports = Spreker;