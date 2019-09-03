import Stage from "../components/Stage";
import appSettings from "../settings/appSettings";
import stagesSettings from "../settings/stagesSettings";
import ScoreBar from "../components/ScoreBar";

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
                this._runStageMode();
            });

            return stage;
        });
    }

    _checkActiveStage() {
        // console.info("[StageManager]", "_checkActiveStage");

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

    _runStageMode() {
        console.warn("RAGE MODE RUN");

        this._openStages.forEach(stage => {
            stage.stageModeOn();
        });

        console.log(this._openStages);
    }

    _stopStageMode() {
        console.warn("RAGE MODE RUN");

        const openStages = this._openStages.forEach(stage => {
            stage.stageModeOn();
        });
    }

    _addEventListener(stage) {
        stage.on("stageScoreUpdate", () => {
            console.info("[StageManager]", "stageScoreUpdate");

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
