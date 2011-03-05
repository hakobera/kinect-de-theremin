var express = require('express');
var socketIo  = require('socket.io');
var ejs = require('ejs');
var net = require('net');

var port = 3000;

/**
 * Express
 */
var app = express.createServer();

app.configure(function() {
    app.use(express.static(__dirname + '/static'));
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});
app.set('view engine', 'ejs');
app.set('view options', { layout: false });

app.get('/', function(req, res) {
    console.log('/');
    res.render('index', { port: port });
});

app.listen(port);

/**
 * Web Socket
 */
var webSocket = socketIo.listen(app);
webSocket.on('connection', function(client) {

    console.log('connected');
    console.log(client);

    /**
     * メッセージ受信時
     */
    client.on('message', function(msg) {
        console.log(msg);
    });

    /**
     * 切断時
     */
    client.on('disconnect', function() {
        console.log('disconnect');
    });
    
});

/**
 * Data Receiver from processing
 */
var kinectTransporter = net.createServer(function(kinect){
    var buff = "";
    kinect.on("data", function(d){
        console.log(d.toString());
        webSocket.broadcast(d.toString());
    });

    kinect.on('error', function (err) {
        console.log("ignoring exception: " + err);
    });
});

kinectTransporter.listen(9999);

console.log('Server running at http://127.0.0.1:' + port + '/');