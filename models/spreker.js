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

Spreker.getAanvragen = function(callback){
    var query = "SELECT * FROM `spreker` ORDER BY `idSpreker` ASC;";
    mysql.connection(function (err, conn) {
        if (err) {
            return callback(err);
        }
        conn.query(query, function (err, rows) {
            if (err) {
                return callback(err);
            }
            var gebruikers = [];

            for (var i = 0; i < rows.length; i++) {
                gebruikers.push({
                    "idSpreker": rows[i].idSpreker,
                    "onderwerp": rows[i].onderwerp,
                    "wensen": rows[i].wensen,
                    "email": rows[i].email,
                    "voorkeurSloten": rows[i].voorkeurSloten,
                    "naam": rows[i].naam,
                });
            }
            return callback(null, gebruikers);
        })
    });
};

module.exports = Spreker;