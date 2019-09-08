import * as PIXI from "pixi.js";
import appSettings from "../settings/appSettings";
// import TexturesLoader from "./TexturesLoader";
import TWEEN from "tween.js";
import Emitter from "component-emitter";

class Starter {
    constructor() {
        this.app = null;

        this._init = {};

        this._init.initPromise = new Promise(resolve => {
            this._init.setInitiated = resolve;
        });

        this.size = { ...appSettings.app };

        new Emitter(this);

        PIXI.utils.skipHello();
    }

    init(container = document.body) {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const view = document.querySelector(`content`);

        this.app = new PIXI.Application({
            width,
            height,
            transparent: true,
            view: view,
        });
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

        setTimeout(() => {
            this.resize();
        }, 0);
    }

    resize() {
        const { width, height } = this.size;
        let { innerWidth: currW, innerHeight: currH } = window;

        let newW,
            newH,
            isLandscape = currW > currH;

        document.body.style.width = currW + "px";
        document.body.style.height = currH + "px";

        var gw, gh;

        if (isLandscape) {
            gh = width;
            gw = Math.floor(gh * (currW / currH));

            if (gw < height) {
                gw = height;
                gh = Math.floor(height * (currH / currW));
            }
        } else {
            gh = height;
            gw = Math.floor(gh * (currW / currH));

            if (gw < width) {
                gw = width;
                gh = Math.floor(width * (currH / currW));
            }
        }

        this.app.view.style.width = currW + `px`;
        this.app.view.style.height = currH + `px`;

        this.app.renderer.resize(gw, gh);

        this.emit(`onResize`, {
            w: gw,
            h: gh,
            isLandscape,
        });
        console.log("RESIZE CALL", gw, gh, isLandscape);

        // if (currH > currW) {
        //     //portrait
        //     newW = currW;
        //     newH = newW * (currH / currW);
        // } else {
        //     //landscape
        //     isLandscape = true;

        //     newH = currH;
        //     newW = newH * (currW / currH);

        //     // this.app.view.scale = currW / currH;
        //     // this.app.stage.scale.x = newW / width;
        //     // this.app.stage.scale.y = newH / height;
        // }

        // this.app.view.style.width = newW + `px`;
        // this.app.view.style.height = newH + `px`;

        // this.app.renderer.resize(newW, newH);

        // this.emit(`onResize`, {
        //     w: newW,
        //     h: newH,
        //     isLandscape,
        // });
        // console.log("RESIZE CALL", newW, newH, isLandscape);
    }

    get initiated() {
        return this._init.initPromise;
    }
}

const starter = new Starter();

export default starter;
