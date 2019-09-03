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
import i18n from "../settings/i18n";

class Stage {
    constructor(config, stageStrategy) {
        this._config = {
            ...config,
            ...appSettings.stage,
            width: appSettings.app.width,
        };
        this._stageStrategy = stageStrategy;

        this._mainContainer = null;
        this._lockContainer = null;
        this._unlockContainer = null;
        this._weapon = null;
        this._lock = null;

        this._ticker = null;

        this.level = this._config.info.level;

        new Emitter(this);

        this._init();
        this.hide();
    }

    get configuration() {
        return this._config.info;
    }

    _init() {
        const {
            width,
            height,
            color,
            y,
            info: { weaponType, level, name },
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

        this.targetsManager = new TargetsManager({
            x: width - 250,
            level: level,
        });

        this.targetsManager.container.setParent(this._unlockContainer);

        this.targetsManager.on("rageMode", () => {
            this.emit("startRageMode");
        });

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

        this._initShotListener();

        this._showStartHint(level);

        this._initAutoPlay();

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
            text: `${i18n.level} ${level}`,
            style: {
                fill: "white",
                fontFamily: "Comic Sans MS",
                fontSize: 40,
            },
        });
        this._levelInfoText.setParent(this._lockContainer);
    }

    stageModeOn() {
        console.log("STAGE MODE ON");

        this._weapon.startRageMode();
        setInterval(() => {
            this._makeShot();
        }, 150);
    }

    _drawOpenLevelButton() {
        const {
            width,
            info: { openLevelCost },
        } = this._config;

        this._openBtnContainer = GraphicsHelper.createContainer({
            x: width / 2 - 125, // 100- half width button
        });
        this._openBtnContainer.setParent(this._lockContainer);

        const { openStageButton } = appSettings.colors;
        this._openButton = new Button({
            width: 250,
            height: 85,
            offset: 30,
            rounded: 15,
            color: openStageButton,
            text: `${i18n.usdIcon}${openLevelCost}`,
            onClick: () => {
                this._openButton.container.visible = false;

                if (ScoreBar.money < openLevelCost) {
                    console.log(`not enough money`);
                    return;
                }

                this.show();
                ScoreBar.update(-openLevelCost);
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

    _initShotListener() {
        this._weapon.on(`shotRequest`, () => {
            this._makeShot();
        });
    }

    _showStartHint(level) {
        // TODO: move hint coordinates settings to weapon
        let hintCoordinates = null;
        switch (level) {
            case "1":
                hintCoordinates = { x: 250, y: 200 };
                break;

            case "2":
                hintCoordinates = { x: 350, y: 180 };
                break;
        }

        if (hintCoordinates !== null) {
            // TODO: add 'destroy' method into hint
            const hint = new Hint(hintCoordinates);
            this._unlockContainer.addChild(hint.sprite);
            this._weapon.once(`shotIsDone`, () => {
                hint.hide();
                this._unlockContainer.removeChild(hint.sprite);
            });
        }
    }

    _initAutoPlay() {
        // TODO: move setting to config

        const timeBetweenShoot = 1000;
        let autoShotsLeft = 5;
        let timeToNextShoot = timeBetweenShoot;

        this._weapon.on(`shotIsDone`, () => {
            autoShotsLeft -= 1;
            timeToNextShoot = timeBetweenShoot;
        });

        this._weapon.once(`shotIsDone`, () => {
            this._ticker = new PIXI.Ticker();
            this._ticker.add(() => {
                if (autoShotsLeft <= 0) {
                    this._ticker.stop();
                    this._ticker.destroy();
                    return;
                }

                const delta = this._ticker.deltaMS;

                timeToNextShoot -= delta;

                if (timeToNextShoot <= 0) {
                    this._makeShot();
                    timeToNextShoot = timeBetweenShoot;
                }
            });
            this._ticker.start();
        });
    }

    _makeShot() {
        const coordinates = this.targetsManager.getHolePosition();

        this._weapon.once(`shotIsDone`, () => {
            const {
                info: { shotReward },
            } = this._config;

            this.targetsManager.makeHole(coordinates);
            this._drawRewardText(shotReward);
            this.emit("stageScoreUpdate");
        });

        this._weapon.shot(coordinates);
    }

    _drawRewardText(value) {
        const y = Utils.random(100, 240);
        const sign = Utils.random(0, 1) === 0 ? -1 : 1;

        this._rewardContainer = GraphicsHelper.createContainer({});
        this._rewardContainer.setParent(this._mainContainer);

        const rewardText = GraphicsHelper.drawText({
            text: `${i18n.usdIcon}${value}`,
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

    hide() {
        this._weapon.hide();
        this._lockContainer.alpha = 1;
        this._unlockContainer.alpha = 0;
    }

    show() {
        //this._openBtnContainer.visible = true;

        this._weapon.show();
        this._lockContainer.alpha = 0;
        this._unlockContainer.alpha = 1;
    }

    showOpenButton() {
        if (this._openBtnContainer) {
            return;
        }

        this._drawOpenLevelButton();

        this._lock.alpha = 0;
        this._levelInfoText.alpha = 0;
        this._openBtnContainer.visible = true;

        const hint = new Hint({
            x: 60,
            y: 70,
        });

        hint.sprite.setParent(this._openBtnContainer);
    }
}

export default Stage;
