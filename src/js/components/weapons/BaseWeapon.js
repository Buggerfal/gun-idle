import starter from "../../Starter";
import settings from "../../settings/settings";
import GraphicsHelper from "../../GraphicsHelper";

class BaseWeapon {
    constructor() {
        this.container = null;

        this.size = { ...settings.app };

        this._init();
    }

    _init() {
        const rocket = GraphicsHelper.createSpriteFromAtlas({
            x: 50,
            y: 50,
            name: `colt911`,
        });

        rocket.setParent(starter.app.stage);
    }
}

export default BaseWeapon;
