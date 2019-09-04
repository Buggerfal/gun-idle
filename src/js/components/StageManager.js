import Stage from "../components/Stage";
import appSettings from "../settings/appSettings";
import stagesSettings from "../settings/stagesSettings";
import ScoreBar from "../components/ScoreBar";
import * as PIXI from "pixi.js";
import TWEEN from "tween.js";
import GraphicsHelper from "../utils/GraphicsHelper";
import starter from "../engine/Starter";
import SceneManager from "../scenes/SceneManager";
import Resizable from "../engine/Resizable";

class StageManager extends Resizable {
    constructor() {
        super();

        this._stages = [];
        this._openStages = [];

        this._activeStage = null;
        this._nextStage = null;

        this._gameProgress = 0;

        this._sizes = {
            appHeight: appSettings.app.height,
            stageHeight: appSettings.stage.height,
        };
    }

    init() {
        let { innerHeight: h, innerWidth: w } = window;

        this._drawStages();
        this._checkActiveStage();

        this._container = GraphicsHelper.createContainer({});
        this._container.setParent(starter.app.stage);

        this._rageModeBackground = GraphicsHelper.createColorContainer({
            x: -10,
            y: -10,
            width: w + 20,
            height: h + 20,
            color: "0x990000",
            alpha: 0,
        });
        this._rageModeBackground.setParent(this._container);

        this._flameIcon = GraphicsHelper.createSpriteFromAtlas({
            x: 100,
            y: h - 150,
            name: `flameIcon`,
            anchor: 0.5,
            alpha: 0,
        });
        this._flameIcon.setParent(this._container);
    }

    _drawStages() {
        let { innerWidth: currW, innerHeight: currH } = window;

        this._stages = stagesSettings.map((stageInfo, index) => {
            const stageNumber = index + 1;
            const color = this._getStageBackgroundColor(stageNumber);

            const stage = new Stage({
                color: color,
                info: stageInfo,
            });

            stage.on("startRageMode", () => {
                this._runRageMode();
            });

            return stage;
        });

        setTimeout(() => {
            this.onResize({ w: currW, h: currH });
        }, 0);
    }

    onResize(data) {
        const { w, h } = data;

        const displayedLevel = w > h ? 3 : 4;

        let { innerHeight: currH } = window;

        let stageHeight = currH / displayedLevel;

        this._stages.forEach((stage, index) => {
            const stageNumber = index + 1;
            const yPosition = currH - stageHeight * stageNumber;

            stage._mainContainer.width = w;
            stage._mainContainer.height = h / displayedLevel + 10;
            stage._mainContainer.y = yPosition;
        });

        if (this._rageModeBackground) {
            this._rageModeBackground.width = w;
            this._rageModeBackground.height = h;
            this._flameIcon.y = h - 100;
        }
    }

    _checkActiveStage() {
        if (this._activeStage === null) {
            this._activeStage = this._stages[0];
            this._openStages.push(this._activeStage);

            this._activeStage.show();

            this._addEventListener(this._activeStage);

            this._nextStage = this._stages[1];
            return;
        }

        const {
            configuration: { gameProgressToUnlock },
        } = this._nextStage;

        if (this._gameProgress >= gameProgressToUnlock) {
            this._gameProgress = 0;

            this._activeStage = this._nextStage;
            this._openStages.push(this._activeStage);

            const nextStageIndex = this._stages.findIndex(
                x => x == this._activeStage
            );

            this._nextStage = this._stages[nextStageIndex + 1];

            this._activeStage.showOpenButton();
            this._addEventListener(this._activeStage);
        }
    }

    //TODO: refactoring, move logic
    _runRageMode() {
        this._openStages.forEach(stage => {
            stage.weapon.runRageModeAnimation();
        });

        //AUTOSHOT (RAGE-MODE) LOGIC
        let timeToOffRageMode = 5000;
        let timeBeetweenShot = 150;

        const ticker = new PIXI.Ticker();
        ticker.add(() => {
            const delta = ticker.deltaMS;

            timeToOffRageMode -= delta;
            timeBeetweenShot -= delta;

            if (timeBeetweenShot <= 0) {
                timeBeetweenShot = 150;
                this._makeShotAllGroup();
            }

            if (timeToOffRageMode <= 0) {
                ticker.stop();
            }
        });
        ticker.start();

        //RED BACKGROUND ANIMATION
        new TWEEN.Tween(this._rageModeBackground)
            .to(
                { alpha: [0.3, 0.1, 0.4, 0.1, 0.5, 0.2, 0.1, 0.4, 0] },
                timeToOffRageMode
            )
            .onComplete(() => {
                starter.app.stage.removeChild(this._rageModeBackground);
                this._openStages.forEach(stage => {
                    stage.weapon.stopRageModeAnimation();
                });
            })
            .start();

        const timeOnAnimation = 700;
        const repeatAnimation =
            Math.floor(timeToOffRageMode / timeOnAnimation) - 1;

        this._flameIcon.alpha = 1;
        new TWEEN.Tween(this._flameIcon.scale)
            .to({ x: [1.1, 1], y: [1.1, 1] }, timeOnAnimation)
            .onComplete(() => {
                new TWEEN.Tween(this._flameIcon)
                    .to({ alpha: 0 }, timeOnAnimation)
                    .start()
                    .onComplete(() => {
                        starter.app.stage.removeChild(this._flameIcon);
                        SceneManager.showScene("outro");
                    });
            })
            .repeat(repeatAnimation)
            .start();

        this._shakeBackground();
    }

    //TODO: refactoring, move logic
    _shakeBackground() {
        new TWEEN.Tween(starter.app.stage)
            .to(
                {
                    x: [-5, 0, 8, -9, 0, 6, 0, -8, 0, 7],
                    y: [0, 4, 0, 6, -7, 3, -5, 0, 6, 0, 9, 0],
                },
                480
            )
            .repeat(10)
            .start();
    }

    _makeShotAllGroup() {
        this._openStages.forEach(stage => {
            stage._makeShot();
        });
    }

    _addEventListener(stage) {
        stage.on("stageScoreUpdate", () => {
            const {
                configuration: { shotReward },
            } = stage;

            ScoreBar.update(shotReward);

            if (stage == this._activeStage) {
                this._gameProgress++;
                this._checkActiveStage();
            }
        });
    }

    _getStageBackgroundColor(stageNumber) {
        const { stage1, stage2 } = appSettings.colors;
        const isEven = stageNumber % 2;

        return isEven ? stage2 : stage1;
    }
}

export default new StageManager();
