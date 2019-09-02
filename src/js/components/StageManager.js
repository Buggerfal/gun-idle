import Stage from "../components/Stage";
import starter from "../engine/Starter";
import appSettings from "../settings/appSettings";
import stagesSettings from "../settings/stagesSettings";
import ScoreBar from "../components/ScoreBar";
import SceneManager from "../scenes/SceneManager";

class StageManager {
    constructor() {
        this._stages = [];
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

            return new Stage({
                color: color,
                y: yPosition,
                info: stageInfo,
            });
        });
    }

    _checkActiveStage() {
        // console.info("[StageManager]", "_checkActiveStage");

        if (this._activeStage === null) {
            this._activeStage = this._stages[0];

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

            const nextStageIndex = this._stages.findIndex(
                x => x == this._activeStage
            );

            this._nextStage = this._stages[nextStageIndex + 1];

            this._activeStage.showOpenButton();
            this._addEventListener(this._activeStage);
        }
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
