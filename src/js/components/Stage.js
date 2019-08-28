import starter from "../Starter";
import GraphicsHelper from "../GraphicsHelper";
import settings from "../settings/settings";
import BaseWeapon from "./weapons/BaseWeapon";

class Stage {
    constructor(config) {
        this._container = null;
        this._weapon = null;

        this._config = {
            ...config,
            ...settings.stage,
            width: settings.app.width,
        };
        this._init();
    }

    _init() {
        const { width, height, color, y } = this._config;

        this._container = GraphicsHelper.createColorContainer({
            x: 0,
            y,
            width: width,
            height: height,
            color: color,
        });
        this._container.setParent(starter.app.stage);

        const weapon = new BaseWeapon();
    }
}

export default Stage;
