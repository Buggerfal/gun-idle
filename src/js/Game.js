import Stage from "./components/Stage";
import starter from "./Starter";
import appSettings from "./settings/appSettings";
import stages from "./settings/stagesSettings";

class Game {
    constructor() {
        starter.initiated.then(() => {
            this._drawStages();
        });

        this._sizes = { ...appSettings.app };
    }

    _drawStages() {
        const stageHeight = appSettings.stage.height;
        const appHeight = this._sizes.height;

        const gameProgress = 20;

        stages.forEach((stageInfo, index) => {
            if (stageInfo.gameProgressToUnlock > gameProgress) {
                return;
            }

            const stageNumber = index + 1;
            const color = this._getStageBackgroundColor(stageNumber);
            const yPosition = appHeight - stageHeight * stageNumber;

            new Stage({
                color: color,
                y: yPosition,
                info: stageInfo,
            });
        });
    }

    _getStageBackgroundColor(stageNumber) {
        const oddsColor = `0x2d1c38`;
        const evenColor = `0x26152f`;
        const isEven = stageNumber % 2;

        return isEven ? evenColor : oddsColor;
    }
}

export default Game;
