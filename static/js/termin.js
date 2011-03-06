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
    var scales = {
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
     * 事前計算した音階値。
     */
    var freq;

    /**
     * サンプリングレート (Hz)
     * @property
     */
    var sampleRate = 44100;

    /**
     * Audio
     * @property
     */
    var audio;

    /**
     * Audio buffer
     */
    var buffer;

    /**
     * Audio buffer size.
     * @private
     */
    var bufferSize;

    /**
     * 単音の発生秒数
     */
    var unitSec = 1;

    /**
     * Initialize audio.
     * @param {Number} ch Number of channels
     * @param {Number} rate Sampling rate
     */
    var setupAudio = function(ch, rate) {
        bufferSize = Math.ceil(rate * unitSec);
        audio = new Audio();
        audio.mozSetup(ch, rate);
        buffer = new Float32Array(bufferSize);
    };

    /**
     * Global object
     */
    Termin = {

        /**
         * 初期化処理。
         */
        initialize: function() {
            var k;

            setupAudio(1, sampleRate);

            freq = {};
            for (k in scales) {
                freq[k] = 2 * Math.PI * scales[k] / sampleRate;
            }

        },

        /**
         * サウンド再生
         */
        startAudio: function(scale) {
            var k = freq[scale];
            for(var i = 0; i < bufferSize; i += 1){
                buffer[i] = Math.sin(k * i);
            }
            audio.mozWriteAudio(buffer);
            audio.play();
        },

        /**
         * 単位ミリ秒数を返します。
         */
        getUnitSec: function() {
            return Math.ceil(unitSec * 1000);
        }

    };
    
})(this);