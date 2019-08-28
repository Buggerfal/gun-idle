import starter from "../../Starter";
import settings from "../../settings/settings";
import GraphicsHelper from "../../GraphicsHelper";

class BaseWeapon {
    constructor() {
        this._mainSprite = null;

        this.size = { ...settings.app };

        this._init();
    }

    _init() {
        this._mainSprite = GraphicsHelper.createSpriteFromAtlas({
            x: 50,
            y: 50,
            name: `colt1911`,
        });
        this._mainSprite.setParent(starter.app.stage);

        this._slideSprite = GraphicsHelper.createSpriteFromAtlas({
            x: 50,
            y: 50,
            name: `slide1911`,
        });
        this._slideSprite.setParent(starter.app.stage);
    }
}

export default BaseWeapon;
