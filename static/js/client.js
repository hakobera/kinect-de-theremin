$(function() {
    // setup
    var socket = new io.Socket(null, { port: port });

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

    var hand = new Image();
    var bg = new Image();

    hand.src = '/images/hand12.gif';
    bg.src = '/images/t01.jpg';

    screen.width = WIDTH;
    screen.height = HEIGHT;


    Termin.initialize({
        sampleRate: 22050,
        unitTime: FRAME_INTERVAL / 1000
    });

    var pointToIndex = function(pt) {
        var nx = Math.floor(12 * (pt.x / WIDTH));
        var ny = Math.floor(5  * (pt.y / HEIGHT));
        return 12 * ny + nx;
    };

    var draw = function() {
        drawContext.fillStyle = '#000';
        drawContext.fillRect(0, 0, WIDTH, HEIGHT);

        drawContext.drawImage(bg, 0, 0, WIDTH, HEIGHT);
        drawContext.drawImage(hand, point.x, point.y - 100);

        if (isPlaying) {
            var index = pointToIndex(point);
            console.log(index);
            Termin.startAudio(index);
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