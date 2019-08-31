import * as PIXI from "pixi.js";
import appSettings from "../settings/appSettings";
import TexturesLoader from "./TexturesLoader";

class Starter {
    constructor() {
        this.app = null;

        this._init = {};

        this._init.initPromise = new Promise(resolve => {
            this._init.setInitiated = resolve;
        });

        this.size = { ...appSettings.app };
    }

    init(container = document.body) {
        const { width, height } = this.size;

        this.app = new PIXI.Application({
            width,
            height,
            transparent: true,
            resizeTo: container,
        });
        this.app.renderer.autoResize = true;
        container.appendChild(this.app.view);

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
            w = window.innerHeight * ratio;
            h = window.innerHeight;
        } else {
            w = window.innerWidth;
            h = window.innerWidth / ratio;
        }

        this.app.renderer.resize(w, h);
        this.app.stage.scale.x = w / width;
        this.app.stage.scale.y = h / height;
    }

    get initiated() {
        return this._init.initPromise;
    }
}

const starter = new Starter();

export default starter;
