import * as PIXI from "pixi.js";
import appSettings from "../settings/appSettings";
import TexturesLoader from "./TexturesLoader";
import TWEEN from "tween.js";
import Emitter from "component-emitter";

class Starter {
    constructor() {
        this.app = null;

        this._orientation = null;

        this._init = {};

        this._init.initPromise = new Promise(resolve => {
            this._init.setInitiated = resolve;
        });

        this.size = { ...appSettings.app };

        new Emitter(this);
    }

    init(container = document.body) {
        const width = window.innerWidth;
        const height = window.innerHeight;

        this.app = new PIXI.Application({
            width,
            height,
            transparent: true,
            resizeTo: container,
        });
        this.app.renderer.autoResize = true;
        container.appendChild(this.app.view);

        this._ticker = new PIXI.Ticker();
        this._ticker.start();
        this._ticker.add(() => {
            TWEEN.update();
        });

        window.onresize = () => {
            this.resize();
        };

        this._init.setInitiated();
        this.resize();
        return this._init.initPromise.then(() => TexturesLoader.ensureLoaded());
    }

    resize() {
        const { width, height } = this.size;
        const ratio = width / height;
        let w, h;

        if (window.innerWidth / window.innerHeight >= ratio) {
            this._orientation = `landscape`;
            w = window.innerHeight * ratio;
            h = window.innerHeight;

            // this._emitOrientationChangeEvent("landscape");
        } else {
            this._orientation = `portrait`;

            w = window.innerWidth;
            h = window.innerWidth / ratio;

            // this._emitOrientationChangeEvent("portrait");
        }

        this.app.view.style.width = w + "px";
        this.app.view.style.height = h + "px";

        this.app.renderer.resize(w, h);
        // this.app.stage.scale.x = w / width;
        // this.app.stage.scale.y = h / height;
        this.emit(`onResize`, { w, h, orientation: this._orientation });
    }

    // _emitOrientationChangeEvent(newOrientation) {
    // if (this._orientation != newOrientation) {
    //     this._orientation = newOrientation;
    //     this.emit(`orientation_${newOrientation}`);
    // }
    // }

    get initiated() {
        return this._init.initPromise;
    }
}

const starter = new Starter();

export default starter;
