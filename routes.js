var express = require('express');
var path = require('path');
var router = express.Router();
var sess;

//Includes
var Agenda  =require('./models/agenda.js');
var Tijdslot = require('./models/tijdslot.js');
var Spreker = require('./models/spreker.js');
var Reservering = require('./models/reservering.js');
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
router.post('/newReservering', function (req, res){
   var post = {
       idGebruiker: '',
       naam: req.body.naam,
       tussenvoegsel: req.body.tussenvoegsel,
       achternaam: req.body.achternaam,
       email: req.body.email,
       rol: 'Bezoeker',
       ticketType: req.body.ticketType,
       maaltijdType: req.body.maaltijdType,
       ticketID: '',
       hashCode: 'mooieHash',
       QRCode: 'QR'
   }; 
    console.log(post);
    Reservering.newGebruiker(post, function(err, callback){
        if(err) {
            console.log(err);
            //redirect toevoegen naar error
        } else {
            console.log("Gebruiker toegevoegd");
            Reservering.getUserdata(post, function(err, callback){
                if(err) {
                    console.log(err);
                } else {
                    sess = req.session;
                    console.log(callback);
                    sess.idGebruiker = callback;
                    sess.ticketID = 1;
                    console.log("Data opgehaald " + sess.idGebruiker);
                        Reservering.newMaaltijd(post, function(err, callback){
                        if(err) {
                            console.log(err);
                            //redirect toevoegen naar error
                        } else {
                            console.log("Maaltijd toegevoegd");
                                Reservering.newOrder(post, function(err, callback){
                                    if(err) {
                                        console.log(err);
                                        //redirect toevoegen naar error
                                    } else {
                                        console.log("Order toegevoegd");
                                    }
                                })
                        }
                    })
                }
            })
        }
    })
});

//Spreker
router.post('/newSpreker', function (req, res){
   var post = {
       idSpreker: null,
       onderwerp: req.body.onderwerp,
       wensen: req.body.wensen,
       voorkeurSloten: req.body.voorkeurSloten,
       toegewezenSloten: req.body.toegewezenSloten,
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