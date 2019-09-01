import * as PIXI from "pixi.js";

class Timer {
    constructor() {
        this._ticker = null;

        this._isStartTimer = false;

        this._startTime = 0;
        this.time = 0;

        this._init();
    }

    _init() {
        this._ticker = new PIXI.Ticker();
        this._ticker.start();
        this._ticker.add(() => {
            this._tick(this._ticker.deltaMS);
        });
    }

    resetTime() {
        this.time = this._startTime;
    }

    start(time) {
        this._startTime = time;
        this.time = time;
        this._isStartTimer = true;
    }

    _tick(delta) {
        if (!this._isStartTimer) {
            return;
        }

        if (this.time <= 0) {
            this.resetTime();
            return;
        }
        this.time -= delta;
    }
}

export default new Timer();
