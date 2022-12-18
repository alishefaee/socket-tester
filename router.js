var express = require('express'),
	fs = require("fs");

var bodyParser = require('body-parser');


var mob_router = express.Router();
mob_router.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }))
mob_router.use(bodyParser.json({ limit: '10mb' }));

mob_router.use('/train_preview.jpg',(req, res, next) => {
    // res.writeHead(200, {
    //     'Cache-Control' : 'no-store'
    // })
    res.sendFile(__dirname + '/ecc200/train.jpg');

});


mob_router.use(express.static('public',{}));


module.exports = mob_router;
