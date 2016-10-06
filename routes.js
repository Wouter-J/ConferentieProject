var express = require('express');
var path = require('path');
var router = express.Router();
var sess;

//Includes
var passwordHash = require('password-hash');
var Agenda  =require('./models/agenda.js');
var Annuleren  =require('./models/annuleren.js');
var Tijdslot = require('./models/tijdslot.js');
var Spreker = require('./models/spreker.js');
var Reservering = require('./models/reservering.js');

//QR-Stuff
var qr = require('qr-image');
var fs = require('fs');

router.get('/qr', function(req, res) {  
  var code = qr.image(new Date().toString(), { type: 'svg' });
  res.type('svg');
  code.pipe(res);
});
//Index
router.get('/', function (req, res) {
    res.render('partials/home.html.twig');
});

//InfoPagina's (Nog vullen & aanmaken)
router.get('/aboutConference', function(req,res){
   res.render('partials/textInfo/aboutConference.html.twig'); 
});
router.get('/aboutOrganizer', function(req,res){
   res.render('partials/textInfo/aboutOrganizer.html.twig'); 
});
router.get('/venue', function(req,res){
   res.render('partials/textInfo/venue.html.twig'); 
});
router.get('/prevConference', function(req,res){
   res.render('partials/textInfo/prevConference.html.twig'); 
});
//Non-function Routes
router.get('/contact', function(req,res){
   res.render('partials/contact.html.twig'); 
});
router.get('/tickets', function(req,res){
   res.render('partials/tickets.html.twig'); 
});
router.get('/inschrijvenSpreker', function(req,res){
   res.render('partials/spreker.html.twig'); 
});
router.get('/tijdslot', function(req,res){
   res.render('partials/tijdslot.html.twig'); 
});
router.get('/annuleerReservering', function(req,res){
   res.render('partials/ticketAnnuleren.html.twig'); 
});
/*
router.get('/betalen', function(req,res){
   res.render('partials/betalen.html.twig'); 
});
*/
//Agenda
router.get('/agenda', function (req, res) { //geen klant
    console.log("Agenda geactiveerd");
        Tijdslot.getSloten(function(err, items2){
            if(err){
                console.log(err);
            } else {
                Agenda.getOptredens(function(err, items){
                    if(err) {
                         console.log(err);
                    } else {
                        res.render('partials/agenda.html.twig', {
                            agenda_items: items,
                            tijdslot_items: items2
                        });
                    }
                })
            }
        })
});
//Tickets
 //Reservering plaatsen
router.post('/newReservering', function (req, res){
   var post = {
       email: req.body.email,
       ticketType: req.body.ticketType,
       maaltijdType: req.body.maaltijdType,
       //ticketID: req.body.ticketID,
       hashCode: passwordHash.generate(req.body.email + req.body.ticketType),
       QRCode: 'QR'
    }; 
    var code = qr.image(passwordHash.generate(req.body.email + req.body.ticketType), { type: 'png' });
  // res.type('svg');
        var output = fs.createWriteStream('memes.png');
       code.pipe(output);  
    //code.pipe(res);
    
    console.log(post);
    Reservering.newOrder(post, function(err, callback){
        if(err) {
            console.log(err);
            //redirect toevoegen naar error
        } else {
            console.log("Ticket toegevoegd");
                Reservering.getTicketID(post, function(err, callback){
                if(err) {
                    console.log(err);
                    //redirect toevoegen naar error
                } else {
                   console.log("ticketID: " + callback);
                   sess = req.session;
                   sess.ticketID = callback;
                   var post = {ticketID: sess.ticketID, maaltijdType: req.body.maaltijdType, ticketType: req.body.ticketType, aantalvrij: ''};
                   console.log(sess.ticketID);
                        Reservering.newMaaltijd(post, function(err, callback){
                        if(err) {
                            console.log(err);
                            //redirect toevoegen naar error
                        } else {
                            console.log("Maaltijd order toegevoegd");
                            Reservering.checkFreeTickets(post, function(err, callback){
                                    if(err) {
                                        console.log(err);
                                        //redirect toevoegen naar error
                                    } else {
                                        console.log("Tickets gechecked " + callback);
                                        res.redirect('/betalen');
                                    }
                                })    
                        }
                    })
                }
            });
        }
    });
});
 //Betaling bevestigen
router.get('/betalen', function(req, res){
    console.log("Prijs Berekening");
        doc = new PDFDocument;
    doc.pipe( fs.createWriteStream('out.pdf') );
    //maaltijdQR toevoegen
    doc.text('Uw geweldige ticket!', 210, 0)
    doc.image('memes.png', 0, 0, { fit: [205, 205] })
    
    doc.end();
    console.log("PDF Klaar")
    res.render('partials/betalen.html.twig');
    //var post = { ticketType: sess.ticketType }
})
router.post('/confirmOrder', function(req,res){
//Mailing-shizzay
    
    console.log("Order bevestigd");

    //var post = {doc: doc }
    fs.readFile('out.pdf', function(err, data) {
        sendgrid.send({
                to:       'wouter97@planet.nl',
                cc:       'wouterjansen97@gmail.com',
                from:     'info@conferentieStorm.nl',
                subject:  'Uw conferentie tickets',
                text:     'Koop mn shit',
                files     : [{filename: 'out.pdf', path: 'out.pdf', content: data, contentType:'application/pdf'}],
                }, function(err, json) {
                if (err) { return console.error(err); }
                console.log(json);
        });
    }); /* Old
    sendgrid.send({
        to:       'jan@mail.nl',
        from:     'info@conferentieStorm.nl',
        cc:       'wouter97@planet.nl',
        subject:  'Uw tickets',
        text:     'Koop mn shit'
        }, function(err, json) {
        if (err) { return console.error(err); }
        console.log(json);
        }); */
    res.render('partials/sucess/betalingGelukt.html.twig');
});

 //Reservering annuleren
router.post('/cancelReservering', function(req, res){
       var post = {
       email: req.body.email,
       hashCode: req.body.hashCode,
       QRCode: 'QR',
    };
    
    console.log("CANCEL"); 
    console.log(post);
    Annuleren.zoekOrder(post, function(err, callback){
        if(err) {
            console.log(err);
            //redirect toevoegen naar error
        } else {
            console.log("ticketID: " + callback);
                   sess = req.session;
                   sess.ticketID = callback;
                   var post = {ticketID: sess.ticketID};
                Annuleren.verwijderOrder(post, function(err, callback){
                    if(err) {
                        console.log(err);
                    } else {
                        console.log("Order destroy >.<");
                        //VERWIJDER EN ERROR SCHERM TOEVOEGEN, OOK CHECK OF BESTAAT, ALS TICKET NIET BESTAAT DAN NIKS DOEN
                    }
                })
        }
    })
});

//Spreker
router.post('/newSpreker', function (req, res){
   var post = {
       //idSpreker: null,
       onderwerp: req.body.onderwerp,
       wensen: req.body.wensen,
       voorkeurSloten: 'meme',
       toegewezenSloten: 'meme',
       rol: 'Spreker',
       maaltijdType: req.body.maaltijdType,
       naam: req.body.naam,
       tussenvoegsel: req.body.tussenvoegsel,
       achternaam: req.body.achternaam,
       email: req.body.email,
       maaltijdType: req.body.maaltijdType
   }; 
    console.log(post);
    Spreker.newSpreker(post, function(err, callback){
        if(err) {
            console.log(err);
            //redirect toevoegen naar error
        } else {
            console.log("Spreker toegevoegd");
        }
    })
});

module.exports = router;