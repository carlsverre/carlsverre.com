export default class Audio {
    constructor(audioDomElement) {
        this.el = audioDomElement;

        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.source = this.ctx.createMediaElementSource(this.el);
        this.analyser = this.ctx.createAnalyser();
        this.analyser.fftSize = 32;

        // connect audio graph
        this.source.connect(this.analyser);
        this.analyser.connect(this.ctx.destination);

        this._fft_buf = new Uint8Array(this.analyser.fftSize);
        this._wave_buf = new Uint8Array(this.analyser.frequencyBinCount);
    }

    play() {
        this.el.play();
    }

    timestamp() {
        return this.ctx.currentTime;
    }

    fft() {
        this.analyser.getByteFrequencyData(this._fft_buf);
        return this._fft_buf;
    }

    waveform() {
        this.analyser.getByteTimeDomainData(this._wave_buf);
        return this._wave_buf;
    }
}
