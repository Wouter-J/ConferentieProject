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

var Reservering = function(){
    ticketID = '';
    hashcode = '';
    QRcode = '';
    idGebruiker = '';
    idMaaltijd = '';
    ticketType = '';
    naam = '';
    tussenvoegsel = '';
    achternaam = '';
    email = '';
    rol = '';
    dagDeel = '';
    prijs = '';
    typeMaaltijd = '';
    tijdstip = '';
}

Reservering.newGebruiker = function(obj, callback) {
    var query = "INSERT INTO `gebruiker` VALUES(NULL,?,?,?,?,?)";
    mysql.connection(function (err, conn){
        if(err) {
            return callback(err);
        }
        conn.query(query, [obj.naam, obj.tussenvoegsel, obj.achternaam, obj.email, obj.rol], function (err, rows){
            if(err){
                return callback(err, null);
            } else {
                return callback(null, rows);
            }
        })
    })
};

Reservering.getUserdata = function(obj, callback){
    var query = "SELECT `idGebruiker` FROM Gebruiker WHERE email = ?;";
    mysql.connection(function (err, conn){
        if(err) {
            return callback(err);
        }
        conn.query(query, [obj.email, obj.idGebruiker], function(err, rows){
            console.log(obj.email);
            var idGebruiker = rows[0].idGebruiker;
            console.log(idGebruiker);
            if(err) { return callback(err, null); }
            else { return callback(null, idGebruiker);}
        })
    })
};

Reservering.newMaaltijd = function(obj, callback){
    var query = "INSERT INTO `maaltijd` VALUES(NULL,?,?)";
    mysql.connection(function (err, conn){
        if(err) {
            return callback(err);
        }
        conn.query(query, [obj.ticketID, obj.maaltijdType], function (err, rows){
            if(err){
                return callback(err, null);
            } else {
                return callback(null, rows);
            }
        })
    })
};

Reservering.newOrder = function(obj, callback) {
    var query = "INSERT INTO `Tickets` VALUES(NULL,?,?,?,?,?)";
        mysql.connection(function (err, conn){
        if(err) {
            return callback(err);
        }
        conn.query(query, [obj.hashCode, obj.QRCode, obj.idGebruiker, obj.idMaaltijd, obj.ticketType], function (err, rows){
            console.log(obj.idGebruiker);
            if(err){
                return callback(err, null);
            } else {
                return callback(null, rows);
            }
        })
    })
}
module.exports = Reservering;