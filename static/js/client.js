$(function() {
    
    var socket = new io.Socket(null, { port: port });
    socket.connect();

    socket.on('connect', function() {
        console.log('connect');
    });

    socket.on('message', function(msg) {
        console.log(msg);
    });

    socket.on('disconnect', function(){
        console.log('disconnect');
    });

});