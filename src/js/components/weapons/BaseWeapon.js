import starter from "../../Starter";
import GraphicsHelper from "../../GraphicsHelper";

export default class BaseWeapon {
    constructor(config) {
        this.config = { ...config };

        this.init();
    }

    init() {}

    shot() {
        console.log(this.config, "SHOT");
    }
}

export class Colt1911 extends BaseWeapon {
    constructor(config) {
        super(config);

        this._container = null;
        this._mainSprite = null;
        this._slideSprite = null;

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
}

export class AK47 extends BaseWeapon {
    constructor(config) {
        super(config);

        this._container = null;
        this._mainSprite = null;
        this._knife = null;
        this._slide = null;

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
}
