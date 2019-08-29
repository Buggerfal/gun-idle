import starter from "../../Starter";
import GraphicsHelper from "../../GraphicsHelper";
import TWEEN from "tween.js";
import * as PIXI from "pixi.js";

export default class BaseWeapon {
    constructor(config) {
        this.config = { ...config };

        this._ticker = new PIXI.Ticker();
        this._ticker.start();

        this._ticker.add(delta => {
            this.tick(delta);
            TWEEN.update();
        });

        this.init();
    }

    init() {}

    shot() {
        console.log(this.config, "SHOT");
        this.animated();
    }

    tick() {}
}

export class Colt1911 extends BaseWeapon {
    constructor(config) {
        super(config);

        this._shotCost = 5;
    }

    init() {
        const { y } = this.config;
        const margin = 50;

        this._container = GraphicsHelper.createContainer({
            x: margin,
            y: y,
        });
        this._container.setParent(starter.app.stage);
        this._container.interactive = true;
        this._container.on("pointerdown", () => {
            this.shot();
        });

        this._mainSprite = GraphicsHelper.createSpriteFromAtlas({
            x: margin,
            y: margin,
            name: `colt1911`,
        });
        this._mainSprite.setParent(this._container);

        this._slideSprite = GraphicsHelper.createSpriteFromAtlas({
            x: margin,
            y: margin,
            name: `slide1911`,
        });
        this._slideSprite.setParent(this._container);
    }

    animated() {
        console.log(this._container, "this._container");
        this.rotationTween = new TWEEN.Tween(this._container)
            .to({ rotation: [-0.17, 0] }, 100)
            .start();

        this.slideTween = new TWEEN.Tween(this._slideSprite.pivot)
            .to({ x: [45, 0] }, 100)
            .start();
    }
}

export class AK47 extends BaseWeapon {
    constructor(config) {
        super(config);

        this._shotCost = 15;
    }

    init() {
        const { y } = this.config;
        const margin = 50;

        this._container = GraphicsHelper.createContainer({
            x: margin,
            y: y,
        });
        this._container.setParent(starter.app.stage);

        this._container.interactive = true;
        this._container.on("pointerdown", () => {
            this.shot();
        });

        this._mainSprite = GraphicsHelper.createSpriteFromAtlas({
            x: margin,
            y: margin,
            name: `ak47`,
        });
        this._mainSprite.setParent(this._container);

        this._knife = GraphicsHelper.createSpriteFromAtlas({
            x: 400,
            y: 125,
            name: `ak47_knife`,
        });
        this._knife.setParent(this._container);

        this._slide = GraphicsHelper.createSpriteFromAtlas({
            x: 125,
            y: 67,
            name: `ak47_slide`,
        });
        this._slide.setParent(this._container);
    }

    animated() {
        console.log(2);
    }
}
