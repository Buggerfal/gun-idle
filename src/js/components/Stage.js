import starter from "../Starter";
import GraphicsHelper from "../GraphicsHelper";
import appSettings from "../settings/appSettings";
import WeaponFactory from "./weapons/WeaponFactory";

class Stage {
    constructor(config) {
        this._container = null;
        this._targetContainer = null;
        this._lockContainer = null;
        this._target = null;
        this._weapon = null;
        this._lock = null;
        this._levelText = null;

        this._config = {
            ...config,
            ...appSettings.stage,
            width: appSettings.app.width,
        };

        this._progress = 0;

        this._init();
    }

    _init() {
        const {
            width,
            height,
            color,
            y,
            info: { weaponType, level },
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
        this._target.scale.set(1.4);
        this._target.setParent(this._targetContainer);

        this._lockContainer = GraphicsHelper.createContainer({
            x: width / 2,
            y: y + height / 2,
        });
        this._lockContainer.setParent(starter.app.stage);

        this._lock = GraphicsHelper.createSpriteFromAtlas({
            x: -100,
            y: 0,
            name: `lockedIcon`,
        });
        this._lock.setParent(this._lockContainer);

        this._levelText = GraphicsHelper.drawText({
            x: 50,
            y: 30,
            text: `level ${level}`,
            style: {
                fill: "white",
                fontFamily: "Comic Sans MS",
                fontSize: 40,
            },
        });

        this._levelText.setParent(this._lockContainer);

        this._weapon = WeaponFactory.createWeapon(weaponType, { y });
    }

    hide() {
        this._target.alpha = 0;
        this._weapon.hide();
        this._lockContainer.alpha = 1;
    }

    show() {
        this._target.alpha = 1;
        this._weapon.show();
        this._lockContainer.alpha = 0;
    }
}

export default Stage;
