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
import Resizable from "../engine/Resizable";

class Stage extends Resizable {
    constructor(config, stageStrategy) {
        super();

        this._config = {
            ...config,
            ...appSettings.stage,
            width: appSettings.app.width,
        };
        this._stageStrategy = stageStrategy;

        this._mainContainer = null;
        this._lockContainer = null;
        this._unlockContainer = null;
        this.weapon = null;
        this._lock = null;

        this._ticker = null;

        this.level = this._config.info.level;

        new Emitter(this);

        this._init();
        this.hide();

        let { innerWidth: currW, innerHeight: currH } = window;

        //TODO: create new logic. Resizable
        setTimeout(() => {
            this.onResize({ w: currW, h: currH });
        }, 20);
    }

    get configuration() {
        return this._config.info;
    }

    onResize(data) {
        const { w, h } = data;

        //landscape
        if (w > h) {
            this._lock.y = 100;
            this._levelInfoText.y = 140;
            this.weapon.container.y = -50;
            this.weapon.container.scale.set(1);
            this.weapon.container.x = 100;
        }

        //portrait
        if (h > w) {
            this._lock.y = 200;
            this._levelInfoText.y = 240;
            this.weapon.container.y = 30;
            this.weapon.container.scale.set(0.7);
            this.weapon.container.x = 0;
        }

        if (this._openBtnContainer) {
            this._openBtnContainer.x = w / 2 - 125; //half button width
            this._openBtnContainer.y = w > h ? 100 : 150;
        }

        if (this._hint) {
            this._hint.sprite.x = w > h ? 300 : 150; //half button width
            this._hint.sprite.y = 150;
        }

        this._unlockContainer.y = this._mainContainer.y;
        this._lockContainer.y = this._mainContainer.y;
        this._lock.x = w / 2 - 120;
        this._levelInfoText.x = this._lock.x + this._lock.width + 100;
    }

    _init() {
        const {
            color,
            info: { weaponType, level, name },
        } = this._config;

        const width = window.innerWidth;

        let { innerWidth: currW, innerHeight: currH } = window;
        let stageHeight = currH / 4;

        this._mainContainer = GraphicsHelper.createColorContainer({
            width: currW,
            height: stageHeight,
            color: color,
        });
        this._mainContainer.setParent(starter.app.stage);

        // //Unlocked stage elements
        this._unlockContainer = GraphicsHelper.createContainer();
        this._unlockContainer.setParent(starter.app.stage);

        this.targetsManager = new TargetsManager({
            x: width - 250,
            level: level,
        });

        this.targetsManager.container.setParent(this._unlockContainer);

        this.targetsManager.on("rageMode", () => {
            this.emit("startRageMode");
        });

        this._weaponName = GraphicsHelper.drawText({
            x: 120,
            y: 50,
            text: `${name}`,
            style: {
                fill: "white",
                fontSize: 40,
            },
        });

        this._weaponName.setParent(this._unlockContainer);

        this.weapon = WeaponFactory.createWeapon(weaponType, {
            y: stageHeight / 2,
        });
        this.weapon.container.setParent(this._unlockContainer);

        this._initShotListener();

        this._showStartHint(level);

        this._initAutoPlay();

        // //Locked stage elements
        this._lockContainer = GraphicsHelper.createContainer({});
        this._lockContainer.setParent(starter.app.stage);

        this._lock = GraphicsHelper.createSpriteFromAtlas({
            x: width / 2 - 100,
            name: `lockedIcon`,
        });
        this._lock.setParent(this._lockContainer);

        this._levelInfoText = GraphicsHelper.drawText({
            x: this._lock.x + this._lock.width + 80,
            text: `${i18n.level} ${level}`,
            style: {
                fill: "white",
                fontSize: 40,
            },
        });
        this._levelInfoText.setParent(this._lockContainer);
    }

    _drawOpenLevelButton() {
        const {
            width,
            info: { openLevelCost },
        } = this._config;

        const { innerWidth: currW, innerHeight: currH } = window;

        const y = currW > currH ? 100 : 150;

        this._openBtnContainer = GraphicsHelper.createContainer({
            x: currW / 2 - 125, // 125- half width button
            y,
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
        this.weapon.on(`shotRequest`, () => {
            this._makeShot();
        });
    }

    _showStartHint(level) {
        // TODO: move hint coordinates settings to weapon
        let hintCoordinates = null;
        switch (level) {
            case "1":
                hintCoordinates = { x: 250, y: 160 };
                break;

            case "2":
                hintCoordinates = { x: 350, y: 160 };
                break;
        }

        if (hintCoordinates !== null) {
            // TODO: add 'destroy' method into hint
            this._hint = new Hint(hintCoordinates);
            this._unlockContainer.addChild(this._hint.sprite);
            this.weapon.once(`shotIsDone`, () => {
                this._hint.hide();
                this._unlockContainer.removeChild(this._hint.sprite);
            });
        }
    }

    _initAutoPlay() {
        // TODO: move setting to config
        const timeBetweenShoot = 1000;
        let autoShotsLeft = 5;
        let timeToNextShoot = timeBetweenShoot;

        this.weapon.on(`shotIsDone`, () => {
            autoShotsLeft -= 1;
            timeToNextShoot = timeBetweenShoot;
        });

        this.weapon.once(`shotIsDone`, () => {
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

        this.weapon.once(`shotIsDone`, () => {
            const {
                info: { shotReward },
            } = this._config;

            this.targetsManager.makeHole(coordinates);
            this._drawRewardText(shotReward);
            this.emit("stageScoreUpdate");
        });

        this.weapon.shot(coordinates);
    }

    _drawRewardText(value) {
        const y = Utils.random(100, 240);
        const sign = Utils.random(0, 1) === 0 ? -1 : 1;
        const { innerWidth: currW, innerHeight: currH } = window;

        const offset = currW > currH ? 400 : 300;

        const rewardText = GraphicsHelper.drawText({
            text: `${i18n.usdIcon}${value}`,
            x: window.innerWidth - offset,
            y,
            style: {
                fill: "white",
                fontSize: 50,
            },
        });
        rewardText.setParent(this._unlockContainer);
        rewardText.rotation = Math.random() * sign;

        new TWEEN.Tween(rewardText).to({ alpha: 0 }, 300).start();
    }

    hide() {
        this.weapon.hide();
        this._lockContainer.alpha = 1;
        this._unlockContainer.alpha = 0;
    }

    show() {
        // this._openBtnContainer.visible = true;
        this.weapon.show();
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
