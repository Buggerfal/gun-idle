import Stage from "./components/Stage";
import starter from "./Starter";
import settings from "./settings/settings";

class Game {
    constructor() {
        starter.initiated.then(() => {
            this._drawStages();
        });

        this._sizes = { ...settings.app };
    }

    _drawStages() {
        const stageHeight = settings.stage.height;
        let yPosition = this._sizes.height - stageHeight;
        let color = `0x2d1c38`;

        console.log(color);
        for (let i = 0; i <= 5; i++) {
            const stage = new Stage({ color: color, y: yPosition });

            yPosition -= stageHeight;
            color = color === `0x2d1c38` ? `0x26152f` : `0x2d1c38`;
        }
    }
}

export default Game;
