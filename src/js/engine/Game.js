import Stage from "../components/Stage";
import starter from "./Starter";
import appSettings from "../settings/appSettings";
import stages from "../settings/stagesSettings";
import ScoreBar from "../components/ScoreBar";
import SceneManager from "../scenes/SceneManager";
import IntroScene from "../scenes/IntroScene";
import OutroScene from "../scenes/OutroScene";

class Game {
    constructor() {
        this._stages = [];

        starter.initiated
            .then(() => {
                this._drawStages();
                ScoreBar.init();
            })
            .then(() => {
                this.introScene = new IntroScene();
                this.OutroScene = new OutroScene();
            })
            .then(() => {
                this._initAppComponents();
            });

        this._sizes = { ...appSettings.app };
        this.scoreBar = ScoreBar;
    }

    _drawStages() {
        const stageHeight = appSettings.stage.height;
        const appHeight = this._sizes.height;
        const gameProgress = 0;

        stages.forEach((stageInfo, index) => {
            const stageNumber = index + 1;
            const color = this._getStageBackgroundColor(stageNumber);
            const yPosition = appHeight - stageHeight * stageNumber;

            const stage = new Stage({
                color: color,
                y: yPosition,
                info: stageInfo,
            });

            stage.on("isOpenNextStage", level => {
                this.isOpenStage(level);
            });

            this._stages.push(stage);
            if (stageInfo.gameProgressToUnlock > gameProgress) {
                stage.hide();
                return;
            }

            stage.show();
        });
    }

    isOpenStage(level) {
        this._stages[level].showOpenButton();
    }

    _initAppComponents() {
        SceneManager.registerScene(`intro`, this.introScene);
        SceneManager.registerScene(`outro`, this.OutroScene);

        SceneManager.showScene(`intro`);
    }

    _getStageBackgroundColor(stageNumber) {
        const { stage1, stage2 } = appSettings.colors;
        const isEven = stageNumber % 2;

        return isEven ? stage2 : stage1;
    }
}

export default Game;
