/**
 * termin.js - JavaScript termin like emulator using Audio Data API.
 *
 * @author hakobera
 */
(function(global) {

    /**
     * 音階に対応した周波数。
     * @property
     */
    var SCALES = {
        C3:     261,
        Cp3:    277,
        D3:     293,
        Dp3:    311,
        E3:     329,
        F3:     349,
        Fp3:    370,
        G3:     392,
        Gp3:    415,
        A3:     440,
        Ap3:    466,
        B3:     493,
        C4:     523
    };

    /**
     * Samples
     * @param conf
     * @class
     */
    var Samples = function(conf) {
        this.freq = conf.freq; // (Hz)
        this.sampleRate = conf.sampleRate;
        this.unitTime = conf.unitTime;
        this.bufferSize = Math.ceil(this.sampleRate * this.unitTime);
        this.buffer = new Float32Array(this.bufferSize);

        var k = 2 * Math.PI * this.freq / this.sampleRate;
        var size = this.bufferSize;
        var i;

        for(i = 0; i < size; i += 1){
            this.buffer[i] = Math.sin(k * i);
        }
    };

    Samples.prototype = {

        getBuffer: function() {
            return this.buffer;
        }

    };

    /**
     * AudioUnit
     *
     * @param conf
     * @constructor
     */
    var AudioUnit = function(conf) {
        this.channel = conf.channel;
        this.sampleRate = conf.sampleRate;
        this.unitTime = conf.unitTime;
        this.samples = conf.samples;

        this.audio = new Audio();
        this.audio.mozSetup(this.channel, this.sampleRate);
    };

    AudioUnit.prototype = {

        /**
         * Play sound.
         *
         * @param {Number} freq frequency
         */
        play: function() {
            var a = this.audio;
            a.mozWriteAudio([]);
            a.mozWriteAudio(this.samples.getBuffer());
            a.play();
        }

    };

    /**
     * Audio unit
     * 
     * @type {Object}
     */
    var audioUnits = {};

    /**
     * Create AudioUnit instance and return it.
     *
     * @param {Number} ch Channel
     * @param {Number} sampleRate sample rate (Hz)
     * @return {AudioUnit} Audio unit
     */
    var createAudioUnit = function(ch, sampleRate, unitTime, samples) {
        var unit = new AudioUnit({
            channel: ch,
            sampleRate: sampleRate,
            unitTime: unitTime,
            samples: samples
        });
        return unit;
    };

    /**
     * @singleton
     */
    var Termin = {

        /**
         * 初期化処理。
         */
        initialize: function(conf) {
            var i, k, freq, audioUnit, samples,
                channel = 1,
                sampleRate = conf.sampleRate,
                unitTime = conf.unitTime;

            var N = 12 * 5;
            for (var j = 0; j < N; ++j) {
                var freq = Math.ceil(Math.pow(2, (j / 12.0)) * 220.0);
                samples = new Samples({
                    freq: freq,
                    sampleRate: sampleRate,
                    unitTime: unitTime
                });
                audioUnit = createAudioUnit(channel, sampleRate, unitTime, samples);
                audioUnits[j] = audioUnit;
            }
        },

        /**
         * サウンド再生
         */
        startAudio: function(i) {
            var audioUnit = audioUnits[i];
            audioUnit.play();
        }

    };

    // Export to global.
    global.Termin = Termin;
    
})(this);