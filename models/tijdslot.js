var mysql = require('../db.js');

var Tijdslot = function (){
    idTijdsloten = '';
    idSpreker = '';
    onderwerpSlot = '';
    zaalNummer = '';
    tijd = '';
};

Tijdslot.getSloten = function(callback){
    var query = "SELECT * FROM `tijdsloten` ORDER BY `idTijdsloten`";
    mysql.connection(function (err,conn){
        if(err){
            return callback(err);

        }
        conn.query(query, function (err, rows){
            if(err){
                return callback(err);
            } var tijdslot = [];
            
           for (var i = 0; i < rows.length; i++) {
                tijdslot.push({
                    "idTijdsloten": rows[i].idTijdsloten,
                    "idSpreker": rows[i].idSpreker,
                    "onderwerpSlot": rows[i].onderwerpSlot,
                    "zaalNummer" : rows[i].zaalNummer,
                    "tijd": rows[i].tijd,
                });
            } return callback(null, tijdslot);
        })
    })
}

module.exports = Tijdslot;
