var mysql = require('../db.js');

var Annuleren = function(){
    hashcode = '';
    QRcode = '';
    ticketType = '';
    email = '';
    ticketID = '';
}

Annuleren.zoekOrder = function(obj, callback){
  var query = "SELECT ticketID from `bestelling` where hashCode = ? AND email=?";
    mysql.connection(function (err, conn) {
        if (err) {
            return callback(err);
        }
        conn.query(query, [obj.hashCode, obj.email, obj.ticketID], function (err, rows) {
            console.log("hashCode: " + obj.hashCode);
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

Annuleren.verwijderOrder = function(obj, callback){
    var query = "DELETE FROM  `bestelling` where ticketID = ?";
    mysql.connection(function (err, conn) {
        if (err) {
            return callback(err);
        }
        conn.query(query, [obj.ticketID], function (err, rows) {
            if (err) {
                console.log("err");
                return callback(err,null);
            } else{
                return callback(null, rows);
            }
        });
    })  
};

module.exports = Annuleren;