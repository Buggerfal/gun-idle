import starter from "../Starter";
import GraphicsHelper from "../GraphicsHelper";
import settings from "../settings/settings";
import BaseWeapon from "./weapons/BaseWeapon";

class Stage {
    constructor(color) {
        this.container = null;

        this._sizes = { ...settings.app };
        this._sizes.height = 300;

        this._init(color);
    }

    _init(color) {
        const { width, height } = this._sizes;
        this.container = GraphicsHelper.createColorContainer({
            x: 0,
            y: 0,
            width: width,
            height: height,
            color: color,
        });
        this.container.setParent(starter.app.stage);

        new BaseWeapon();
    }
}

export default Stage;
