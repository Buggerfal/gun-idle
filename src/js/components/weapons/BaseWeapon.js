import starter from "../../Starter";
import settings from "../../settings/settings";
import GraphicsHelper from "../../GraphicsHelper";

class BaseWeapon {
    constructor(config) {
        this._mainSprite = null;
        this._slideSprite = null;

        this._config = { ...config };

        this._init();
    }

    _init() {
        const { y } = this._config;
        const margin = 50;

        this._mainSprite = GraphicsHelper.createSpriteFromAtlas({
            x: 50,
            y: y + 50,
            name: `colt1911`,
        });
        this._mainSprite.setParent(starter.app.stage);

        this._slideSprite = GraphicsHelper.createSpriteFromAtlas({
            x: 50,
            y: y + 50,
            name: `slide1911`,
        });
        this._slideSprite.setParent(starter.app.stage);
    }
}

export default BaseWeapon;
