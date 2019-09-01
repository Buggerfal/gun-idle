import Stage from "../components/Stage";
import starter from "./Starter";
import appSettings from "../settings/appSettings";
import stages from "../settings/stagesSettings";
import ScoreBar from "../components/ScoreBar";
import SceneManager from "../scenes/SceneManager";
import IntroScene from "../scenes/IntroScene";

class Game {
    constructor() {
        this._stages = [];

        starter.initiated.then(() => {
            this._drawStages();
            this._initAppComponents();
        });

        this._sizes = { ...appSettings.app };
        this.scoreBar = ScoreBar;

        this.introScene = new IntroScene();
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

            this._stages.push(stage);

            if (stageInfo.gameProgressToUnlock > gameProgress) {
                stage.hide();
                return;
            }

            stage.show();
        });
    }

    _initAppComponents() {
        this.scoreBar.init();
        this.introScene.init();
        SceneManager.registerScene(`intro`, this.introScene);
        SceneManager.showScene(`intro`);
    }

    _getStageBackgroundColor(stageNumber) {
        const oddsColor = `0x2d1c38`;
        const evenColor = `0x26152f`;
        const isEven = stageNumber % 2;

        return isEven ? evenColor : oddsColor;
    }
}

export default Game;
