import GraphicsHelper from "../utils/GraphicsHelper";
import TWEEN from "tween.js";
import * as PIXI from "pixi.js";
import starter from "../engine/Starter";
import Emitter from "component-emitter";

class Target {
    constructor(config) {
        this._config = { ...config };

        this._lives = 5;
        new Emitter(this);

        this._init();
    }

    _init() {
        const { x, y, owner } = this._config;

        this._target = GraphicsHelper.createSpriteFromAtlas({
            x,
            y,
            name: `target`,
        });
        this._target.scale.set(1.4);
        this._target.pivot.x = -130;
        this._target.setParent(owner);
    }

    _shake() {
        const { x, y, owner } = this._config;

        // this._targetTween = new TWEEN.Tween(owner.pivot)
        //     .to({ x: [-10, 0, 10, -5, 0, 5, 0] }, 180)
        //     .start();
    }

    makeHole(y) {
        const { x, owner } = this._config;
        this._shake();

        if (this._lives <= 0) {
            this.destroy();
            return;
        }

        const initXposition = x + Math.floor(Math.random() * 85 + 15);
        const initYposition = scrollY + Math.floor(Math.random() * 135 + 50);

        const hole = GraphicsHelper.createSpriteFromAtlas({
            x: initXposition,
            y: initYposition,
            name: `hole`,
        });
        hole.scale.set(0.3);
        hole.setParent(owner);

        this._lives -= 1;
    }

    get sprite() {
        return this._target;
    }

    destroy() {
        const { owner } = this._config;
        this.emit("destroyTarget");
        owner.removeChild(this._target);
        this._target.destroy();
    }
}

export default Target;
