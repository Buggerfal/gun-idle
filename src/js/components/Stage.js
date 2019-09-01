import starter from "../engine/Starter";
import GraphicsHelper from "../utils/GraphicsHelper";
import appSettings from "../settings/appSettings";
import WeaponFactory from "./weapons/WeaponFactory";
import ScoreBar from "./ScoreBar";
import TargetsManager from "./TargetsManager";

class Stage {
    constructor(config) {
        this._mainContainer = null;
        this._lockContainer = null;
        this._unlockContainer = null;
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

        this._mainContainer = GraphicsHelper.createColorContainer({
            x: 0,
            y,
            width: width,
            height: height,
            color: color,
        });
        this._mainContainer.setParent(starter.app.stage);

        //Unlocked stage elements
        this._unlockContainer = GraphicsHelper.createContainer();
        this._unlockContainer.setParent(this._mainContainer);

        this.targetsManager = new TargetsManager(width - 250);

        this.targetsManager.container.setParent(this._unlockContainer);

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

        this._weaponName.setParent(this._unlockContainer);

        this._weapon = WeaponFactory.createWeapon(weaponType, { y });
        this._weapon.container.setParent(this._unlockContainer);

        this._weapon.on(`shotRequest`, () => {
            const coordinates = this.targetsManager.getHolePosition();

            this._weapon.once(`shotIsDone`, y => {
                this.targetsManager.makeHole(coordinates);
                ScoreBar.update(shotReward);
            });

            this._weapon.shot(coordinates);
        });

        //Locked stage elements
        this._lockContainer = GraphicsHelper.createContainer({ y: height / 2 });
        this._lockContainer.setParent(this._mainContainer);

        this._lock = GraphicsHelper.createSpriteFromAtlas({
            x: width / 2 - 50,
            name: `lockedIcon`,
        });
        this._lock.setParent(this._lockContainer);

        const margin = 100;

        GraphicsHelper.drawText({
            x: this._lock.x + this._lock.width + margin,
            y: 30,
            text: `level ${level}`,
            style: {
                fill: "white",
                fontFamily: "Comic Sans MS",
                fontSize: 40,
            },
        }).setParent(this._lockContainer);
    }

    hide() {
        this._weapon.hide();
        this._lockContainer.alpha = 1;
        this._unlockContainer.alpha = 0;
    }

    show() {
        this._weapon.show();
        this._lockContainer.alpha = 0;
        this._unlockContainer.alpha = 1;
    }
}

export default Stage;
