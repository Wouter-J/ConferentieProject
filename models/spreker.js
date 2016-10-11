/* idSpreker
onderwerp
wensen
voorkeurSloten
toegewezenSloten
naam
tussenvoegsel
achternaam
email
rol
idMaaltijd

*/
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
        conn.query(query, [obj.onderwerp, obj.wensen, obj.voorkeurSloten, obj.toegewezenSloten, obj.naam, obj.tussenvoegsel, obj.achternaam, obj.email, obj.rol, obj.maaltijdType], function (err, rows) {
            if (err) {
                return callback(err,null);
            } else{
                return callback(null, rows);
            }
        });
    })
};

module.exports = Spreker;