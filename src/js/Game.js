import Stage from "./components/Stage";
import starter from "./Starter";
import appSettings from "./settings/appSettings";
import stages from "./settings/stagesSettings";
import ScoreBar from "./components/ScoreBar";
class Game {
    constructor() {
        starter.initiated.then(() => {
            this._drawStages();
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

            if (stageInfo.gameProgressToUnlock > gameProgress) {
                stage.hide();
                return;
            }

            stage.show();
        });

        this.scoreBar.init();
    }

    _getStageBackgroundColor(stageNumber) {
        const oddsColor = `0x2d1c38`;
        const evenColor = `0x26152f`;
        const isEven = stageNumber % 2;

        return isEven ? evenColor : oddsColor;
    }
}

export default Game;
