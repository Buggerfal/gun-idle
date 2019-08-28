import starter from "../../Starter";
import GraphicsHelper from "../../GraphicsHelper";

export default class BaseWeapon {
    constructor(config) {
        this._config = { ...config };

        this._init();
    }

    _init() {
        const { y } = this._config;
        const margin = 50;

        this._container = GraphicsHelper.createContainer({
            x: margin,
            y: y,
        });
        this._container.setParent(starter.app.stage);

        this._container.interactive = true;
        this._container.on("pointerdown", () => {
            console.log(1234);
        });
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

    _init() {
        super._init();

        const margin = 50;

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
