var express = require('express');
var path = require('path');
var router = express.Router();

//Includes


//Index
router.get('/', function (req, res) {
    res.render('partials/home.html.twig');
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

module.exports = router;