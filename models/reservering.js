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
    tijdstip = '';
    aantalvrij = '';
    lunchVrijdag = '';
    lunchZaterdag = '';
    lunchZondag = '';
    dinerZaterdag = '';
    dinerZondag = '';
    totaalAantalTickets = '';
}

Reservering.newMaaltijd = function(obj, callback){
    var query = "INSERT INTO `Maaltijd` VALUES (NULL, ?, ?, ?, ?, ?, ?,?)";
    mysql.connection(function (err, conn){
        if(err) {
            return callback(err);
        }
        //Clean the array's of their pesky comma business.
        obj.lunchVrijdag = obj.lunchVrijdag.join("");
        obj.lunchZaterdag = obj.lunchZaterdag.join("");
        obj.dinerZaterdag = obj.dinerZaterdag.join("");
        obj.lunchZondag = obj.lunchZondag.join("");
        obj.dinerZondag = obj.dinerZondag.join("");

        conn.query(query, [obj.ticketID, obj.lunchVrijdag, obj.lunchZaterdag, obj.dinerZaterdag, obj.lunchZondag, obj.dinerZondag, obj.idSpreker], function (err, rows){
            if(err){
                return callback(err, null);
            } else {
                return callback(null, rows);
            }
        })
    })
};

Reservering.updateSpreker = function(obj, callback){
    var query = "SELECT idMaaltijd FROM `Maaltijd` WHERE idSpreker = ?";
        mysql.connection(function (err, conn){
        if(err) {
            return callback(err);
        }
        conn.query(query, [obj.idSpreker, obj.idMaaltijd], function (err, rows){
            var idMaaltijd = rows[0].idMaaltijd
            if(err){
                return callback(err, null);
            } else {
                obj.idMaaltijd = idMaaltijd;
                console.log("IDMAALTIJD " +obj.idMaaltijd)
                var query2 = "UPDATE `Spreker` SET idMaaltijd = ? WHERE idSpreker = ?";
                    mysql.connection(function (err, conn){
                        if(err) {
                            return callback(err);
                        }
                        conn.query(query2, [obj.idMaaltijd, obj.idSpreker], function (err, rows){
                            if(err){
                                return callback(err, null);
                            } else {
                                return callback(null, rows);
                            }
                        })
                    })
                }
            })
        })
};

Reservering.newTicket = function(obj, callback){
    var query = "INSERT INTO `Tickets` VALUES (?, ?, ?, ?)";
    mysql.connection(function (err, conn){
        if(err) {
            return callback(err);
        }
        //Clean the array's of their pesky comma business.
        obj.ticketVrijdag = obj.ticketVrijdag.join("");
        obj.ticketZaterdag = obj.ticketZaterdag.join("");
        obj.ticketZondag = obj.ticketZondag.join("");

        conn.query(query, [obj.ticketID, obj.ticketVrijdag, obj.ticketZaterdag, obj.ticketZondag], function (err, rows){
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
            if(obj.ticketType == undefined || obj.ticketType == '') {
                console.log("Undefined, gimme dat errror. ERROR NOG OPLOSSEN");
                var ticketError = 'leeg';
                return callback(null, ticketError)
            }
            console.log("ticketType: " + obj.ticketType);
            var aantalVrij = rows[0].aantalVrij;
            console.log(aantalVrij);
            if (err) {
                console.log("err");
                return callback(err,null);
            }
            if (aantalVrij <= 0 ) {
                console.log("geen tickets meer");
            }
            else{
            var query2 = "set SQL_SAFE_UPDATES = 0; UPDATE `Bestellingen` SET aantalVrij = aantalVrij - ? - ? - ? WHERE ticketType = ?;";
                mysql.connection(function (err, conn) {
                if (err) {
                    return callback(err);
                }
                conn.query(query2, [obj.ticketVrijdag, obj.ticketZaterdag, obj.ticketZondag, obj.ticketType], function (err, rows) {
                                if (err) {
                console.log("err");
                return callback(err,null);
            }
                    else {
                        console.log("Verlaging gelukt");
                        //return callback(null, aantalVrij);
                    }
                    });
                }) 
            }
        });
    })
};
Reservering.getTicketPrice = function(obj, callback){
    var query = "SELECT prijs from `Bestellingen` where ticketType = ?";
    mysql.connection(function (err, conn) {
        if (err) {
            return callback(err);
        }
        conn.query(query, [obj.ticketType, obj.prijs], function (err, rows) {
            if(obj.ticketType == undefined || obj.ticketType == '') {
                console.log("Undefined, gimme dat errror. ERROR NOG OPLOSSEN");
                var ticketError = 'leeg';
                return callback(null, ticketError)
            }
            console.log("ticketType: " + obj.ticketType);
            var prijs = rows[0].prijs;
            console.log(prijs);
            if (err) {
                console.log("err");
                return callback(err,null);
            }
            else{
                return callback(null, prijs);
            }
        })
    })
};
                   
Reservering.getTicketID = function(obj, callback){
  var query = "SELECT ticketID from `Bestelling` where email = ?";
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
    var query = "INSERT INTO `Bestelling` VALUES(NULL,?,?,?,?,?)";
        mysql.connection(function (err, conn){
        if(err) {
            return callback(err);
        }
        conn.query(query, [obj.hashCode, obj.QRCode, obj.ticketType, obj.email, obj.totaalAantalTickets], function (err, rows){
            if(err){
                return callback(err, null);
            } else {
                return callback(null, rows);
            }
        })
    })
};

module.exports = Reservering;