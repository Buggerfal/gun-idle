import starter from "../../engine/Starter";
import GraphicsHelper from "../../utils/GraphicsHelper";
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

    hide() {}

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
            y: y + margin,
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

    _drawSleeve() {
        this._sleeveSprite = GraphicsHelper.createSpriteFromAtlas({
            x: 145,
            y: 70,
            name: `sleeve`,
        });
        this._sleeveSprite.scale.set(0.4);

        this._sleeveSprite.setParent(this._container);
    }

    hide() {
        this._container.alpha = 0;
        this._container.interactive = false;
    }

    show() {
        this._container.alpha = 1;
        this._container.interactive = true;
    }

    animated() {
        // this._drawSleeve();

        this.rotationTween = new TWEEN.Tween(this._container)
            .to({ rotation: [-0.17, 0] }, 80)
            .start();

        this.slideTween = new TWEEN.Tween(this._slideSprite.pivot)
            .to({ x: [45, 0] }, 80)
            .start();

        // this.sleeveTween = new TWEEN.Tween(this._sleeveSprite.pivot)
        //     .to(
        //         {
        //             x: [50, 100, 150, 200, 250],
        //             y: [100, 250, 300, 350, 400, 450],
        //         },
        //         180
        //     )
        //     .onUpdate(k => {
        //         this._sleeveSprite.rotation = -k;
        //     })
        //     // .interpolation(TWEEN.Interpolation.Bezier)
        //     // .easing(TWEEN.Easing.Linear.None)
        //     .start();
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

    hide() {
        this._container.alpha = 0;
        this._container.interactive = false;
    }

    show() {
        this._container.alpha = 1;
        this._container.interactive = true;
    }

    animated() {}
}
