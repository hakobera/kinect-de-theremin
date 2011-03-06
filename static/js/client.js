$(function() {
    var socket = new io.Socket(null, { port: port });
    var loopTimer;

    var codeIndex = 0;
    var codes = ['C3', 'D3', 'E3', 'F3', 'G3', 'A3', 'B3', 'C4' ];

    try {
        socket.connect();
    } catch(e) {
        alert(e.message);
    }

    Termin.initialize();

    $('#play').click(function(event) {
        event.preventDefault();
        loopTimer = setInterval(function() {
            var scale = codes[codeIndex];
            codeIndex += 1;
            if (codeIndex >= codes.length) {
                codeIndex = 0;
            }

            Termin.startAudio(scale);
        }, Termin.getUnitSec());
    });

    $('#stop').click(function(event) {
        event.preventDefault();
        if (loopTimer) {
            clearInterval(loopTimer);
        }
    });

    socket.on('connect', function() {
        console.log('connect');
    });

    socket.on('message', function(msg) {
        console.log(msg);
        var pt = JSON.parse(msg);
        $('#data').append($('<li>').html("x=" + pt.x + ", y=" + pt.y));
        // console.log(msg);
    });

    socket.on('disconnect', function(){
        console.log('disconnect');
    });

});