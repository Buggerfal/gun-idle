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
        const view = document.querySelector("content");

        this.app = new PIXI.Application({
            width,
            height,
            transparent: true,
            view: view,
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
        let { innerWidth: currW, innerHeight: currH } = window;

        if (this.glW === currW && this.glH === currH) return;

        let newW, newH;

        if (currH > currW) {
            //portrait
            newW = width;
            newH = newW * (currH / currW);
        } else {
            //landscape
            newH = height;
            newW = newH * (currW / currH);
        }

        this.app.view.style.width = newW + "px";
        this.app.view.style.height = newH + "px";

        this.app.renderer.resize(newW, newH);

        this.emit(`onResize`, { newW, newH, orientation: this._orientation });
    }

    get initiated() {
        return this._init.initPromise;
    }
}

const starter = new Starter();

export default starter;
