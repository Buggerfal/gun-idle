import starter from "../engine/Starter";
import GraphicsHelper from "../utils/GraphicsHelper";
import appSettings from "../settings/appSettings";
import WeaponFactory from "./weapons/WeaponFactory";
import Target from "./Target";
import ScoreBar from "./ScoreBar";
import TargetsManager from "./TargetsManager";

class Stage {
    constructor(config) {
        this._container = null;
        this._targetContainer = null;
        this._lockContainer = null;
        this._target = null;
        this._weapon = null;
        this._lock = null;

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
            info: { weaponType, level, name, shotReward },
        } = this._config;

        this._container = GraphicsHelper.createColorContainer({
            x: 0,
            y,
            width: width,
            height: height,
            color: color,
        });
        this._container.setParent(starter.app.stage);

        this.targetsManager = new TargetsManager(width - 250);

        this.targetsManager.container.setParent(this._container);

        this._lockContainer = GraphicsHelper.createContainer({
            x: width / 2,
            y: height / 2,
        });
        this._lockContainer.setParent(this._container);

        this._lock = GraphicsHelper.createSpriteFromAtlas({
            x: -100,
            y: 0,
            name: `lockedIcon`,
        });
        this._lock.setParent(this._lockContainer);

        GraphicsHelper.drawText({
            x: 50,
            y: 30,
            text: `level ${level}`,
            style: {
                fill: "white",
                fontFamily: "Comic Sans MS",
                fontSize: 40,
            },
        }).setParent(this._lockContainer);

        this._weaponName = GraphicsHelper.drawText({
            x: 100,
            y: 50,
            text: `${name}`,
            style: {
                fill: "white",
                fontFamily: "Comic Sans MS",
                fontSize: 40,
            },
        });

        this._weaponName.setParent(this._container);

        this._weapon = WeaponFactory.createWeapon(weaponType, { y });
        this._weapon.container.setParent(this._container);

        this._weapon.on(`shotRequest`, () => {
            const coordinates = this.targetsManager.getHolePosition();

            this._weapon.once(`shotIsDone`, y => {
                this.targetsManager.makeHole(coordinates);
                ScoreBar.update(shotReward);
            });

            this._weapon.shot(coordinates);
        });
    }

    hide() {
        // this._weapon.hide();
        // this._lockContainer.alpha = 1;
        // this._nameContainer.alpha = 0;
    }

    show() {
        // this._weapon.show();
        // this._lockContainer.alpha = 0;
        // this._nameContainer.alpha = 1;
    }
}

export default Stage;
