import Stage from "./components/Stage";
import starter from "./Starter";

class Game {
    constructor() {
        starter.initiated.then(() => {
            this._drawStages();
        });
    }

    _drawStages() {
        new Stage(`0x2d1c38`);
    }
}

export default Game;
