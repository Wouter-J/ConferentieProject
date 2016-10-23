var express = require('express');
var path = require('path');
var router = express.Router();
var sess;

//Includes
var passwordHash = require('password-hash');
var Annuleren  =require('./models/annuleren.js');
var Tijdslot = require('./models/tijdslot.js');
var Spreker = require('./models/spreker.js');
var Reservering = require('./models/reservering.js');
var Organisator = require('./models/organisator.js');

//QR-Stuff
var qr = require('qr-image');
var fs = require('fs');
var _ = require('underscore');
var moment = require('moment');
moment().format();

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
router.get('/login', function(req,res){
   res.render('partials/login.html.twig'); 
});
router.get('/inchecken', function(req,res){
   res.render('partials/incheck.html.twig'); 
});
//Agenda
router.get('/agenda', function (req, res) { //geen klant
    console.log("Agenda geactiveerd");
        Tijdslot.getSloten(function(err, items2){
            if(err){
                console.log(err);
            } else {
                res.render('partials/agenda.html.twig', {tijdslot_items: items2});
            }
        })
});

//Tickets
 //Reservering plaatsen
router.post('/newReservering', function (req, res){
    var code = qr.image(passwordHash.generate(req.body.email + req.body.ticketType), { type: 'png' });
    var output = fs.createWriteStream('memes.png');
    code.pipe(output);  

   var post = {
       email: req.body.email,
       ticketType: req.body.ticketType,
       //ticketID: req.body.ticketID,
       hashCode: passwordHash.generate(req.body.email + req.body.ticketType),
       QRCode: 'memes.png',
       lunchVrijdag: req.body.lunchVrijdag,
       lunchZaterdag: req.body.lunchZaterdag,
       lunchZondag: req.body.lunchZondag,
       dinerZaterdag:req.body.dinerZaterdag,
       dinerZondag: req.body.dinerZondag,
       ticketVrijdag: req.body.ticketVrijdag,
       ticketZaterdag: req.body.ticketZaterdag,
       ticketZondag: req.body.ticketZondag,
       //Deze oplossing kan, weekend & parse-partout zijn dan gewoon korting
    }; 
    console.log(post);
    Reservering.newOrder(post, function(err, callback){
        if(err) {
            console.log(err);
            res.render('partials/error/betalingError.html.twig');
        } else {
            console.log("Ticket toegevoegd");
                Reservering.getTicketID(post, function(err, callback){
                if(err) {
                    console.log(err);
                    res.render('partials/error/betalingError.html.twig');
                } else {
                   console.log("ticketID: " + callback);
                    //session list
                    sess = req.session;
                    sess.ticketID = callback;
                    sess.ticketType = req.body.ticketType;
                    sess.ticketVrijdag = req.body.ticketVrijdag;
                    sess.ticketZaterdag = req.body.ticketZaterdag;
                    sess.ticketZondag = req.body.ticketZondag;
                    sess.maaltijdType = req.body.maaltijdType;
                    sess.lunchVrijdag=  req.body.lunchVrijdag;
                    sess.lunchZaterdag= req.body.lunchZaterdag;
                    sess.lunchZondag= req.body.lunchZondag;
                    sess.dinerZaterdag =req.body.dinerZaterdag;
                    sess.dinerZondag = req.body.dinerZondag;
                    
                   var post = {
                       ticketID: sess.ticketID,
                       maaltijdType: req.body.maaltijdType,
                       ticketType: req.body.ticketType,
                       aantalvrij: '',
                       lunchVrijdag: req.body.lunchVrijdag,
                       lunchZaterdag: req.body.lunchZaterdag,
                       lunchZondag: req.body.lunchZondag,
                       dinerZaterdag:req.body.dinerZaterdag,
                       dinerZondag: req.body.dinerZondag,
                        //Ticket time
                       ticketVrijdag: req.body.ticketVrijdag,
                       ticketZaterdag: req.body.ticketZaterdag,
                       ticketZondag: req.body.ticketZondag,
                   };
                   console.log(sess.ticketID);
                        Reservering.newMaaltijd(post, function(err, callback){
                        if(err) {
                            console.log(err);
                            res.render('partials/error/betalingError.html.twig');
                        } else {
                            console.log("Maaltijd order toegevoegd");
                            Reservering.newTicket(post, function(err, callback){
                            if(err) {
                                console.log(err);
                                res.render('partials/error/betalingError.html.twig');
                            } else {
                                console.log("Ticket order toegevoegd");
                                res.redirect('/betalen');
                               /* Reservering.checkFreeTickets(post, function(err, callback){
                                        if(err) {
                                            console.log(err);
                                            //redirect toevoegen naar error
                                        } 
                                        if(callback == 'leeg'){
                                            console.log("Niks ingevuld");
                                        }
                                        else {
                                            var session = post.ticketID
                                            console.log("Tickets gechecked " + callback);
                                            res.redirect('/betalen');
                                        }
                                    }) */     
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
    var post = {
        ticketType: sess.ticketType, 
        maaltijdType: sess.maaltijdType, 
        ticketVrijdag: sess.ticketVrijdag, 
        ticketZaterdag: sess.ticketZaterdag, 
        ticketZondag: sess.ticketZondag, 
        lunchVrijdag: sess.lunchVrijdag, 
        lunchZaterdag: sess.lunchZaterdag, 
        dinerZaterdag: sess.dinerZaterdag, 
        lunchZondag: sess.lunchZondag, 
        dinerZondag: sess.dinerZondag
    }
    //Clean the array's of their pesky comma business.
    post.ticketVrijdag = post.ticketVrijdag.join("");
    post.ticketZaterdag = post.ticketZaterdag.join("");
    post.ticketZondag = post.ticketZondag.join("");
    post.lunchVrijdag = post.lunchVrijdag.join("");
    post.lunchZaterdag = post.lunchZaterdag.join("");
    post.dinerZaterdag = post.dinerZaterdag.join("");
    post.lunchZondag = post.lunchZondag.join("");
    post.dinerZondag = post.dinerZondag.join("");
    
    Reservering.getTicketPrice(post, function(err, callback){  
        if(err){
            console.log(err);
            res.render('partials/error/betalingError.html.twig');
        } else {
            console.log("prijs opgehaald " + callback);
            var priceTicket = callback;
            console.log(post.lunchZaterdag);
            if (post.lunchVrijdag != 0 || post.lunchZaterdag != 0 || post.lunchZondag != 0){
                    var lunch = 1;
            } else {
                   var lunch = 0;
               }
            if(post.dinerZaterdag != 0 || post.dinerZondag != 0){ 
                var diner = 1;
            } else {
                var diner = 0
            }
            //Ticket
            var calculation = priceTicket * post.ticketVrijdag;
            var calculation2 = priceTicket * post.ticketZaterdag;
            var calculation3 = priceTicket * post.ticketZondag;
            var solution = calculation + calculation2 + calculation3;
            console.log(calculation);
            console.log(calculation2);
            console.log(calculation3);
            console.log(solution);
            
            //verdere calculaties en solution toevoegen
            if(lunch = 1){
                var lunchCalculation = 20 * post.lunchVrijdag;
                var lunchCalculation2 = 20 * post.lunchZaterdag;
                var lunchCalculation3 = 20 * post.lunchZondag;
                var lunchSolution = lunchCalculation + lunchCalculation2 + lunchCalculation3;
            }
            if(diner = 1){
                var dinerCalculation = 30 * post.dinerZaterdag;
                var dinerCalculation2 = 30 * post.dinerZondag;
                var dinerSolution = dinerCalculation + dinerCalculation2;
            }
            var foodSolution = dinerSolution + lunchSolution;
            var completePrice = foodSolution + solution;
            
                doc = new PDFDocument;
                doc.pipe( fs.createWriteStream('out.pdf') );
                //maaltijdQR toevoegen
                doc.text('Uw geweldige ticket!', 210, 0)
                doc.image('memes.png', 0, 0, { fit: [205, 205] })
                //doc.newPage();
                //doc.text(session.ticketID); //verdere info toevoegen !!
                doc.end();
                console.log("PDF Klaar");
                
            res.render('partials/betalen.html.twig', {
                solution: solution, 
                priceTicket: priceTicket, 
                ticketVrijdag: post.ticketVrijdag,
                ticketZaterdag: post.ticketZaterdag,
                ticketZondag: post.ticketZondag,
                foodSolution: foodSolution,
                completePrice: completePrice,
            });
        }
    })
});

router.post('/confirmOrder', function(req,res){
//Mailing-shizzay    
    console.log("Order bevestigd");
    fs.readFile('out.pdf', function(err, data) {
        sendgrid.send({
                to:       'wouter97@planet.nl',
                cc:       'wouterjansen97@gmail.com',
                from:     'info@conferentieStorm.nl',
                subject:  'Uw conferentie tickets',
                text:     'Veel plezier!',
                files     : [{filename: 'out.pdf', path: 'out.pdf', content: data, contentType:'application/pdf'}],
                }, function(err, json) {
                if (err) { return console.error(err); }
                console.log(json);
        });
    }); 
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
       maaltijdType: req.body.maaltijdType,
       lunchVrijdag: req.body.lunchVrijdag,
       lunchZaterdag: req.body.lunchZaterdag,
       lunchZondag: req.body.lunchZondag,
       dinerZaterdag:req.body.dinerZaterdag,
       dinerZondag: req.body.dinerZondag,
   }; 
    console.log(post);
    Reservering.newMaaltijd(post, function(err, callback){
        if(err) {
            console.log(err);
            //redirect toevoegen naar error
        } else {
            Spreker.newSpreker(post, function(err, callback){
                if(err) { console.log(err); }
                else {
                    Spreker.getID(post, function(err, callback){
                        if(err) {
                            console.log(err);
                        } else {
                            sess = req.session;
                            sess.idSpreker = callback;
                            sess.onderwerp = req.body.onderwerp;
                            console.log("Maaltijd toegevoegd");
                            var post = {       idSpreker: sess.idSpreker,
                                               onderwerp: sess.onderwerp,
                                               wensen: req.body.wensen,
                                               voorkeurSloten: 'meme',
                                               toegewezenSloten: 'meme',
                                               rol: 'Spreker',
                                               maaltijdType: req.body.maaltijdType,
                                               naam: req.body.naam,
                                               tussenvoegsel: req.body.tussenvoegsel,
                                               achternaam: req.body.achternaam,
                                               email: req.body.email,
                                               maaltijdType: req.body.maaltijdType,
                                               lunchVrijdag: req.body.lunchVrijdag,
                                               lunchZaterdag: req.body.lunchZaterdag,
                                               lunchZondag: req.body.lunchZondag,
                                               dinerZaterdag:req.body.dinerZaterdag,
                                               dinerZondag: req.body.dinerZondag,
                                       }
                            if(post.maaltijdType == 'maaltijdVrijdag'){
                                res.redirect('/tijdslot2');
                            }
                            if(post.maaltijdType == 'maaltijdZaterdag'){
                                console.log("Zaterdag");
                            }
                            if(post.maaltijdType == 'maaltijdZondag'){
                                console.log("Zondag");
                            }
                        }
                    })
                    
                }
            }) 
        }
    });
});
//Ophalen sloten
router.get('/tijdslot2', function(req, res){
    Tijdslot.getSlots(function(err, items2){
            if(err){
                console.log(err);
            } else {
                res.render('partials/tijdslot2.html.twig', {slot_items: items2});
            }
        })
});

//Organisator
//Login
router.post('/loginUser', function (req, res){ 
    var post = {
        email: req.body.email,
        wachtwoord: req.body.wachtwoord
    };
    sess = req.session;
    console.log('/login geactiveerd');
    Organisator.loginUser(post, function (err, callback){
        console.log("Callback: " +callback);
        if (err){
            console.log(err);
        } 
        if(callback == 0){
            res.render('partials/errors/errorLogin.html.twig');
        }
        if(callback == 1){
            console.log("Sessie aanmaken");
            sess.email = req.body.email;
            sess.pwd   = req.body.wachtwoord;
            console.log("Gebruikt email " + sess.email + "Gebruikt pwd: " + sess.pwd);
            sess.rol = 'Organisator';
            console.log(sess.rol);
            res.render('partials/backend.html.twig');
            //Link check inbouwen op backend
        }
        if(callback == 0){
            console.log("Error melding: w8woord of email niet correct");
            //ERROR MELDING INBOUWEN
        }
    })
});

//Actieve gebruikers
router.get('/bezoekerOverzicht', function(req, res){
    console.log("Ophalen bezoekers");
    Organisator.getGebruikers(function(err, items){
                if(err) {
                     console.log(err);
                } else {
                    res.render('partials/bezoekerOverzicht.html.twig', {
                        bezoekers: items,
                    });
                }
    });
});

//Inchecken
router.post('/checkinUser', function(req, res){
    var post = {
                email: req.body.email,
                incheckTijd: new Date(),
               }
    Organisator.getUser(post, function(err, callback){
        if(err) {
            console.log(err);
            res.render('partials/error/checkinError.html.twig');
        }
        if(callback = 'leeg'){
            res.render('partials/error/checkinError.html.twig');
        }
        else {
            console.log("ticketID: " + callback);
            sess = req.session;
            sess.ticketID = callback;
            var post = {
                        email: req.body.email,
                        incheckTijd: new Date(),
                        aantalGebruikers: 3,
                        ticketID: sess.ticketID
                       }
            console.log(post);
            Organisator.checkinUser(post, function(err, callback){
                if(err) {
                    console.log(err);
                    res.render('partials/error/checkinError.html.twig');
                } else {
                    res.render('partials/sucess/checkinSucess.html.twig');
                }
            })
        }
    })
});

//Toekennen sloten
router.get('/toekennenSloten', function(req,res){
    console.log("Ophalen aanvragen");
    Spreker.getAanvragen(function(err, items){
            if(err) {
                console.log(err);
            } else {
                res.render('partials/toekennen.html.twig', {
                sprekers: items,
            });
        }
    });
});

router.post('/slotToekennen', function(req,res){
    var post = {
        idSpreker: req.body.idSpreker,
        keuze: req.body.keuze
    }
    if(post.keuze == 'afkeuren'){
        console.log("Aanvraag afgekeurd");
        Organisator.denyRequest(post, function(err, callback){
                if(err) {
                    console.log(err);
                    //Error scherm
                } else {
                    console.log("Aanvraag verwijderd");
                    //deletescherm
                }
        })
    }
    if(post.keuze == 'goedkeuren'){
        console.log("Aanvraag goedgekeurd");
        Spreker.getAanvraag(post, function(err, callback){
            if(err){
                console.log(err);
            } else {
                //Variable time
                var idSpreker = callback[0].idSpreker;
                var idSlot = callback[0].idSlot;
                var onderwerpSlot = callback[0].onderwerpSlot;
                var zaalNummer = callback[0].zaalNummer;
                var beginTijd = callback[0].beginTijd;
                var eindTijd = callback[0].eindTijd;
                
                var post = {
                    idSpreker: idSpreker,
                    idSlot: idSlot,
                    onderwerpSlot: onderwerpSlot,
                    zaalNummer: zaalNummer,
                    beginTijd: beginTijd,
                    eindTijd: eindTijd,
                }
                console.log(post);
                Organisator.allowRequest(post, function(err, callback){
                        if(err) {
                            console.log(err);
                            //Error scherm
                        } else {
                            Organisator.takeSlot(post, function(err, callback){
                            if(err) {
                                console.log(err);
                                //Error scherm
                            } else {
                            console.log("Aanvraag toegevoegd aan agenda");
                            var post = { idSpreker: idSpreker}
                            Organisator.denyRequest(post, function(err, callback){
                                if(err) {
                                    console.log(err);
                                    //Error scherm
                                } else {
                                    console.log("Aanvraag verwijderd");
                                    //deletescherm
                                  }
                            }) 
                        }
                            })
                        }
                }) 
            }
        }) 
    }
});

router.post('/slotKeuze', function(req, res){
   console.log("Keuze doorgegeven");
   var post = {
       idSpreker: sess.idSpreker,
       idSlot: req.body.idSlot,
       onderwerpSlot: sess.onderwerp,
       zaalNummer: req.body.zaalnummer,
       beginTijd: req.body.beginTijd,
       eindTijd: req.body.eindTijd,
       keuzeType: req.body.keuzeType,
       datum: new Date()
   }
   console.log(post);
   Spreker.getSlotStatus(post, function(err, callback){
        if(err) {
            console.log(err);
            //redirect toevoegen naar error
        } else {
            var status = callback;
            if(status == 'Beschikbaar' || status == 'Onder voorbehoud'){
                Spreker.occupySlot(post, function(err, callback){
                if(err) {
                    console.log(err);
                    //redirect toevoegen naar error
                } else {
                    Spreker.aanvraagPlaatsen(post, function(err, callback){
                        if(err) {
                            console.log(err);
                            //redirect toevoegen naar error
                        } else {
                            console.log("Slot keuze gemaakt");
                            //Sucess scherm
                        }
                   })
            }
            if(status == 'Bezet'){
                console.log('Keuze mag niet, probeer opnieuw');
                //Bezet scherm
            }
        })
            }
        }
   })
   
});
module.exports = router;