import Stage from "./components/Stage";

class Game {
    constructor() {
        console.log(1);
        this._drawStages();
    }

    _drawStages() {
        new Stage(`0x09ff0F`);
    }
}

export default Game;
