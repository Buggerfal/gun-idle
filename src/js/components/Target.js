import GraphicsHelper from "../utils/GraphicsHelper";
import TWEEN from "tween.js";
import * as PIXI from "pixi.js";

class Target {
    constructor(config) {
        this._config = { ...config };
        this._container = null;

        this._lives = 10;

        this._ticker = new PIXI.Ticker();
        this._ticker.start();

        this._ticker.add(delta => {
            TWEEN.update();
        });

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
        this._target.setParent(owner);
    }

    _shake() {
        const { x, y, owner } = this._config;

        this._targetTween = new TWEEN.Tween(owner.pivot)
            .to({ x: [-10, 0, 10, -5, 0, 5, 0] }, 180)
            .start();
    }

    makeHole() {
        const { x, owner } = this._config;
        this._shake();

        if (this._lives <= 0) {
            owner.removeChildren();
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
}

export default Target;
