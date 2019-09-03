import Stage from "../components/Stage";
import appSettings from "../settings/appSettings";
import stagesSettings from "../settings/stagesSettings";
import ScoreBar from "../components/ScoreBar";
import * as PIXI from "pixi.js";
import TWEEN from "tween.js";
import GraphicsHelper from "../utils/GraphicsHelper";
import starter from "../engine/Starter";
import SceneManager from "../scenes/SceneManager";

class StageManager {
    constructor() {
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
        this._drawStages();
        this._checkActiveStage();
    }

    _drawStages() {
        const { stageHeight, appHeight } = this._sizes;

        this._stages = stagesSettings.map((stageInfo, index) => {
            const stageNumber = index + 1;
            const color = this._getStageBackgroundColor(stageNumber);
            const yPosition = appHeight - stageHeight * stageNumber;

            const stage = new Stage({
                color: color,
                y: yPosition,
                info: stageInfo,
            });

            stage.on("startRageMode", () => {
                this._runRageMode();
            });

            return stage;
        });
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

    _runRageMode() {
        //TODO: refactoring
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

        //RED BACKGROUND LOGIC
        const stageModeBackground = GraphicsHelper.createColorContainer({
            width: appSettings.app.width,
            height: appSettings.app.height,
            color: "0x990000",
        });
        stageModeBackground.setParent(starter.app.stage);

        new TWEEN.Tween(stageModeBackground)
            .to(
                { alpha: [0.3, 0.1, 0.4, 0.1, 0.5, 0.2, 0.1, 0.4, 0] },
                timeToOffRageMode
            )
            .onComplete(() => {
                starter.app.stage.removeChild(stageModeBackground);
            })
            .start();

        //FLAME ICON LOGIC
        const flameIcon = GraphicsHelper.createSpriteFromAtlas({
            x: 100,
            y: appSettings.app.height - 130,
            name: `flameIcon`,
            anchor: 0.5,
        });
        flameIcon.setParent(starter.app.stage);

        const timeOnAnimation = 700;
        const repeatAnimation =
            Math.floor(timeToOffRageMode / timeOnAnimation) - 1;

        new TWEEN.Tween(flameIcon.scale)
            .to({ x: [1.1, 1], y: [1.1, 1] }, timeOnAnimation)
            .onComplete(() => {
                new TWEEN.Tween(flameIcon)
                    .to({ alpha: 0 }, timeOnAnimation)
                    .start()
                    .onComplete(() => {
                        starter.app.stage.removeChild(flameIcon);
                        SceneManager.showScene("outro");
                    });
            })
            .repeat(repeatAnimation)
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
