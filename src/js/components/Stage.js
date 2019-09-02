import starter from "../engine/Starter";
import GraphicsHelper from "../utils/GraphicsHelper";
import appSettings from "../settings/appSettings";
import WeaponFactory from "./weapons/WeaponFactory";
import ScoreBar from "./ScoreBar";
import TargetsManager from "./TargetsManager";
import Utils from "../utils/utils";
import TWEEN from "tween.js";
import Emitter from "component-emitter";
import * as PIXI from "pixi.js";
import Hint from "./Hint";
import Button from "./Button";

class Stage {
    constructor(config) {
        this._mainContainer = null;
        this._lockContainer = null;
        this._unlockContainer = null;
        this._weapon = null;
        this._lock = null;

        this._ticker = null;

        this._config = {
            ...config,
            ...appSettings.stage,
            width: appSettings.app.width,
        };

        this.level = this._config.info.level;

        this._autoGameCounter = 4;
        this._timeBetweenShoot = 1000;
        this._shotReward = 0;

        this._autoGameStart = false;

        new Emitter(this);

        this._init();
    }

    _init() {
        const {
            width,
            height,
            color,
            y,
            info: { weaponType, level, name, shotReward, openLevelCost },
        } = this._config;

        this._shotReward = shotReward;

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

        this.targetsManager = new TargetsManager(width - 250, this._shotReward);

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

        this._setListener();

        this._setTimerLogic(level);

        //Locked stage elements
        this._lockContainer = GraphicsHelper.createContainer({ y: height / 2 });
        this._lockContainer.setParent(this._mainContainer);

        this._lock = GraphicsHelper.createSpriteFromAtlas({
            x: width / 2 - 100,
            name: `lockedIcon`,
        });
        this._lock.setParent(this._lockContainer);

        this._levelInfoText = GraphicsHelper.drawText({
            x: this._lock.x + this._lock.width + 80,
            y: 30,
            text: `level ${level}`,
            style: {
                fill: "white",
                fontFamily: "Comic Sans MS",
                fontSize: 40,
            },
        });
        this._levelInfoText.setParent(this._lockContainer);

        this._openBtnContainer = GraphicsHelper.createContainer({
            x: width / 2 - 125, // 100- half width button
        });
        this._openBtnContainer.setParent(this._lockContainer);

        this._openButton = new Button({
            width: 250,
            height: 85,
            offset: 30,
            color: "0x4ccea8",
            text: `$${openLevelCost}`,
            onClick: () => {
                this.show();
            },
            fontSize: 50,
        });

        this._openButton.container.setParent(this._openBtnContainer);

        this._openBtnContainer.visible = false;

        this._lockBtnIcon = GraphicsHelper.createSpriteFromAtlas({
            x: 20,
            y: 10,
            name: `lockedIcon`,
        });
        this._lockBtnIcon.setParent(this._openBtnContainer);
    }

    _setListener() {
        this._weapon.on(`shotRequest`, () => {
            const coordinates = this.targetsManager.getHolePosition();

            this._weapon.once(`shotIsDone`, () => {
                this.targetsManager.makeHole(coordinates);
                ScoreBar.update(this._shotReward);
                this._drawRewardText(this._shotReward);
            });

            this._weapon.shot(coordinates);

            if (this._autoGameCounter <= 0) {
                this.emit("isOpenNextStage", this.level);
            }

            this._autoGameCounter -= 1;
            this._timeBetweenShoot = 1000;
        });
    }

    _setTimerLogic(level) {
        switch (level) {
            case "1":
                this._setAutoPlayLogic({ x: 250, y: 220 });
                break;

            case "2":
                this._setAutoPlayLogic({ x: 350, y: 220 });
                break;

            default:
                console.log("This stage not has logic");
        }
    }

    _setAutoPlayLogic(coordinates) {
        const { x, y } = coordinates;
        //TODO: hint must be one element on two scenes
        const hint = new Hint({ x, y });

        this._weapon.once(`timerStart`, () => {
            this._autoGameStart = true;
            hint.sprite.alpha = 0;
        });

        this._unlockContainer.addChild(hint.sprite);

        this._ticker = new PIXI.Ticker();
        this._ticker.start();
        this._ticker.add(() => {
            this._tick(this._ticker.deltaMS);
        });
    }

    _makeShot() {
        if (this._autoGameCounter <= 0) {
            this.emit("isOpenNextStage", this.level);
            return;
        }

        if (this._autoGameCounter <= 0) {
            this._autoGameStart = false;
        }

        this._autoGameCounter -= 1;

        const coordinates = this.targetsManager.getHolePosition();
        this._weapon.shot(coordinates);
        this.targetsManager.makeHole(coordinates);
        ScoreBar.update(this._shotReward);
        this._drawRewardText(this._shotReward);
    }

    _drawRewardText(value) {
        const y = Utils.random(100, 240);
        const sign = Utils.random(0, 1) === 0 ? -1 : 1;

        this._rewardContainer = GraphicsHelper.createContainer({});
        this._rewardContainer.setParent(this._mainContainer);

        const rewardText = GraphicsHelper.drawText({
            text: `$${value}`,
            x: this._mainContainer.width - 350,
            y,
            style: {
                fill: "white",
                fontFamily: "Comic Sans MS",
                fontSize: 50,
            },
        });
        rewardText.setParent(this._rewardContainer);
        rewardText.rotation = Math.random() * sign;

        new TWEEN.Tween(this._rewardContainer).to({ alpha: 0 }, 300).start();
    }

    _tick(delta) {
        if (!this._autoGameStart) {
            return;
        }

        this._timeBetweenShoot -= delta;

        if (this._timeBetweenShoot <= 0) {
            this._makeShot();
            this._timeBetweenShoot = 1000;
        }
    }

    hide() {
        this._weapon.hide();
        this._lockContainer.alpha = 1;
        this._unlockContainer.alpha = 0;
    }

    show() {
        this._openBtnContainer.visible = true;
        this._weapon.show();
        this._lockContainer.alpha = 0;
        this._unlockContainer.alpha = 1;
    }

    showOpenButton() {
        if (this._openBtnContainer.visible) {
            return;
        }

        this._lock.alpha = 0;
        this._levelInfoText.alpha = 0;
        this._openBtnContainer.visible = true;

        const hint = new Hint({
            x: 60,
            y: 90,
        });

        hint.sprite.setParent(this._openBtnContainer);
    }
}

export default Stage;
