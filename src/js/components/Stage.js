import starter from "../Starter";
import GraphicsHelper from "../GraphicsHelper";
import * as PIXI from "pixi.js";

class Stage {
    constructor() {}

    _init(config) {
        const { x, y, level } = config;

        this.sprite = GraphicsHelper.createSprite({
            name: "asteroid",
            x,
            y,
        });
        this.sprite.anchor.set(0.5);
        this.sprite.setParent(starter.app.stage);

        CollisionManager.registerObject(this);

        this._ticker = new PIXI.Ticker();
        this._ticker.start();
        this._ticker.add(() => {
            TWEEN.update();
            this._tick();
        });

        this._move(level);
    }
}

export default Stage;
