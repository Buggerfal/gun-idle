import Stage from "./components/Stage";
import starter from "./Starter";
import appSettings from "./settings/appSettings";
import stagesSettings from "./settings/stagesSettings";

class Game {
    constructor() {
        starter.initiated.then(() => {
            this._drawStages();
        });

        this._sizes = { ...appSettings.app };
    }

    _drawStages() {
        const stages = { ...stagesSettings };
        const stageHeight = appSettings.stage.height;
        let yPosition = this._sizes.height - stageHeight;
        let color = `0x2d1c38`;

        for (var level in stages) {
            const stage = new Stage({
                color: color,
                y: yPosition,
                level: level,
            });

            yPosition -= stageHeight;
            color = color === `0x2d1c38` ? `0x26152f` : `0x2d1c38`;
        }
    }
}

export default Game;
