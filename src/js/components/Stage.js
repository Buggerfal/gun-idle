import starter from "../Starter";
import GraphicsHelper from "../GraphicsHelper";
import { BaseWeapon, Colt1911 } from "./weapons/BaseWeapon";
import appSettings from "../settings/appSettings";

class Stage {
    constructor(config) {
        this._container = null;
        this._weapon = null;

        this._config = {
            ...config,
            ...appSettings.stage,
            width: appSettings.app.width,
        };

        this._level = this._config.level;

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

        this._weapon = new Colt1911({ y: y });
    }
}

export default Stage;
