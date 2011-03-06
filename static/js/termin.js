/**
 * termin.js - JavaScript termin like emulator using Audio Data API.
 *
 * @author hakobera
 */
(function(global) {

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

        this.audio = new Audio();
        this.audio.mozSetup(this.channel, this.sampleRate);

        console.log(this.sampleRate);
        console.log(this.unitTime);
        this.bufferSize = Math.ceil(this.sampleRate * this.unitTime);
        this.buffer = new Float32Array(this.bufferSize);

        console.log(this.bufferSize);
    };

    AudioUnit.prototype = {

        /**
         * Play sound.
         *
         * @param {Number} freq frequency
         */
        play: function(freq) {
            var i = 0,
                size = this.bufferSize,
                buf = this.buffer;

            for(i = 0; i < size; i += 1){
                buf[i] = Math.sin(freq * i);
            }

            this.audio.mozWriteAudio([]);
            this.audio.mozWriteAudio(buf);
            this.audio.play();
        }

    };

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
     * 事前計算した音階値。
     */
    var freq;


    /**
     * Audio トラック数
     */
    var AUDIO_UNIT_NUM = 8;


    /**
     * Audio ユニット配列
     * @type {Array}
     */
    var audioUnits = [];

    /**
     * 現在使用している Audio オブジェクトのインデックス
     */
    var audioUnitIndex = 0;

    /**
     * 利用可能な Audio オブジェクトを返します。
     */
    var getAvailableAudioUnit = function() {
        audioUnitIndex += 1;
        if (audioUnitIndex >= AUDIO_UNIT_NUM) {
            audioUnitIndex = 0;
        }
        console.log(audioUnitIndex);
        return audioUnits[audioUnitIndex];
    }

    /**
     * Create AudioUnit instance and return it.
     *
     * @param {Number} ch Channel
     * @param {Number} sampleRate sample rate (Hz)
     * @return {AudioUnit} Audio unit
     */
    var createAudioUnit = function(ch, sampleRate, unitTime) {
        var unit = new AudioUnit({
            channel: ch,
            sampleRate: sampleRate,
            unitTime: unitTime
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
            var i, k,
                channel = 1,
                sampleRate = conf.sampleRate,
                unitTime = conf.unitTime;

            for (i = 0; i < AUDIO_UNIT_NUM; i += 1) {
                audioUnits[i] = createAudioUnit(channel, sampleRate, unitTime);
            }

            freq = {};
            for (k in SCALES) {
                freq[k] = 2 * Math.PI * SCALES[k] / sampleRate;
            }
        },

        /**
         * サウンド再生
         */
        startAudio: function(conf) {
            var scale = conf.scale,
                f = freq[scale],
                unit = getAvailableAudioUnit();

            unit.play(f);
        }

    };

    // Export to global.
    global.Termin = Termin;
    
})(this);