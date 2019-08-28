import starter from "../../Starter";
import GraphicsHelper from "../../GraphicsHelper";

export default class BaseWeapon {
    constructor(config) {
        this.config = { ...config };

        this.init();
    }

    init() {}

    shot() {
        console.log(this.config, "TEST");
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
        console.log("init Colt1911");

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
        this._slideSprite = null;

        this._shotCost = 5;
    }

    init() {
        console.log("init AK47");

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

        this._slideSprite = GraphicsHelper.createSpriteFromAtlas({
            x: margin,
            y: margin,
            name: `slide1911`,
        });
        this._slideSprite.setParent(this._container);
    }
}
