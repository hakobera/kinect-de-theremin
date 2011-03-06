$(function() {
    // setup
    var socket = new io.Socket(null, { port: port });
    var loopTimer;

    var codeIndex = 0;
    var codes = ['C3', 'D3', 'E3', 'F3', 'G3', 'A3', 'B3', 'C4' ];

    try {
        socket.connect();
    } catch(e) {
        alert(e.message);
        return;
    }

    var isAudioDataApiEnabled = function () {
        var a = new Audio();
        if (typeof a.mozSetup == 'undefined') return false;
        if (typeof a.mozWriteAudio == 'undefined') return false;
        return true;
    };

    if (!isAudioDataApiEnabled()) {
        alert('Your browser not support Audio Data API.');
        return;
    }

    var WIDTH = 640;
    var HEIGHT = 480;
    var FRAME_INTERVAL = 200;

    var screen = document.getElementById('screen');
    var drawContext = screen.getContext('2d');
    var point = { x: 0, y: 0 };
    var isPlaying = false;

    screen.width = WIDTH;
    screen.height = HEIGHT;

    Termin.initialize({
        sampleRate: 22050,
        unitTime: FRAME_INTERVAL / 1000
    });

    var draw = function() {
        drawContext.fillStyle = '#000';
        drawContext.fillRect(0, 0, WIDTH, HEIGHT);

        drawContext.fillStyle = '#fff';
        drawContext.fillRect(point.x, point.y, 10, 10);

        if (isPlaying) {
            var index = Math.floor((point.x / WIDTH) * codes.length);
            var scale = codes[index];
            console.log(scale);
            Termin.startAudio({
               scale: scale,
               amp: 1
            });
        }
    };

    setInterval(draw, FRAME_INTERVAL);

    $('#play').click(function(event) {
        isPlaying = true;
    });

    $('#stop').click(function(event) {
        isPlaying = false;
    });

    socket.on('connect', function() {
        console.log('connect');
    });

    socket.on('message', function(msg) {
        //console.log(msg);
        point = JSON.parse(msg);
        // console.log(msg);
    });

    socket.on('disconnect', function(){
        console.log('disconnect');
    });

});