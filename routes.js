var express = require('express');
var path = require('path');
var router = express.Router();
var sess;
var prijs = null;

//Includes


//Index
router.get('/', function (req, res) {
    res.render('partials/home.html.twig');
});

router.get('/contact', function(req,res){
   res.render('partials/contact.html.twig'); 
});

module.exports = router;