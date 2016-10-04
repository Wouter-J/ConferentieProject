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
    aantalvrij = '';
}

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
Reservering.checkFreeTickets = function(obj, callback){
    var query = "SELECT aantalVrij from `Bestellingen` where ticketType = ?";
    mysql.connection(function (err, conn) {
        if (err) {
            return callback(err);
        }
        conn.query(query, [obj.ticketType, obj.aantalVrij], function (err, rows) {
            console.log("ticketType: " + obj.ticketType);
            var aantalVrij = rows[0].aantalVrij;
            console.log(aantalVrij);
            if (err) {
                console.log("err");
                return callback(err,null);
            } else{
                return callback(null, aantalVrij);
            }
        });
    })
};

Reservering.getTicketID = function(obj, callback){
    //QUERY VERANDEREN, EMAIL ZAL MEERDERE SHIT TERUGSTUREN
  var query = "SELECT ticketID from `tickets` where email = ?";
    mysql.connection(function (err, conn) {
        if (err) {
            return callback(err);
        }
        conn.query(query, [obj.email, obj.ticketID], function (err, rows) {
            console.log("Email: " + obj.email);
            var ticketID = rows[0].ticketID;
            console.log(ticketID);
            if (err) {
                console.log("err");
                return callback(err,null);
            } else{
                return callback(null, ticketID);
            }
        });
    })
}; 

Reservering.newOrder = function(obj, callback) {
    var query = "INSERT INTO `Tickets` VALUES(NULL,?,?,?,?)";
        mysql.connection(function (err, conn){
        if(err) {
            return callback(err);
        }
        conn.query(query, [obj.hashCode, obj.QRCode, obj.ticketType, obj.email], function (err, rows){
            if(err){
                return callback(err, null);
            } else {
                return callback(null, rows);
            }
        })
    })
}
module.exports = Reservering;