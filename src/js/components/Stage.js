import starter from "../Starter";
import GraphicsHelper from "../GraphicsHelper";
import appSettings from "../settings/appSettings";
import WeaponFactory from "./weapons/WeaponFactory";

class Stage {
    constructor(config) {
        this._container = null;
        this._weapon = null;

        this._config = {
            ...config,
            ...appSettings.stage,
            width: appSettings.app.width,
        };

        this._progress = 0;

        this._init();
    }

    static _lockedLevelPreview() {
        // TODO: draw preview
    }

    unlock() {}

    _init() {
        const {
            width,
            height,
            color,
            y,
            info: { weaponType },
        } = this._config;

        this._container = GraphicsHelper.createColorContainer({
            x: 0,
            y,
            width: width,
            height: height,
            color: color,
        });
        this._container.setParent(starter.app.stage);

        this._targetContainer = GraphicsHelper.createContainer({
            x: 0,
            y,
        });
        this._targetContainer.setParent(starter.app.stage);

        this._target = GraphicsHelper.createSpriteFromAtlas({
            x: width - 150,
            y: 50,
            name: `target`,
        });
        this._target.setParent(this._targetContainer);

        this._weapon = WeaponFactory.createWeapon(weaponType, { y });
    }
}

export default Stage;
