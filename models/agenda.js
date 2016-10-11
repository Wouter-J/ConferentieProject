var mysql = require('../db.js');

var Agenda = function () {
    idTijdslot = '';
    zaalNummer = '';
    onderwerp = '';
};

Agenda.getOptredens = function(callback){
    var query = "SELECT * FROM `agenda` ORDER BY `idTijdslot` ASC;";
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
                    "idAgenda": rows[i].idAgenda,
                    "begin": rows[i].begin,
                    "eind": rows[i].eind,
                    "zaalNummer": rows[i].zaalNummer,
                    "optreden": rows[i].optreden,
                    "speciaalEvenement": rows[i].speciaalEvenement,
                    "onderhoud": rows[i].onderhoud,
                    "verbouwing": rows[i].verbouwing,
                    "schoonmaak": rows[i].schoonmaak,
                    "onderwerp": rows[i].onderwerp,
                });
            }
            return callback(null, agenda);
        })
    });
};


module.exports = Agenda;