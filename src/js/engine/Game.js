import starter from "./Starter";
import ScoreBar from "../components/ScoreBar";
import SceneManager from "../scenes/SceneManager";
import IntroScene from "../scenes/IntroScene";
import OutroScene from "../scenes/OutroScene";
import StageManager from "../components/StageManager";

class Game {
    constructor() {
        starter.initiated.then(() => {
            StageManager.init();
            ScoreBar.init();

            this.introScene = new IntroScene();
            this.outroScene = new OutroScene();

            SceneManager.registerScene(`intro`, this.introScene);
            SceneManager.registerScene(`outro`, this.outroScene);

            SceneManager.showScene(`intro`);
        });
    }
}

export default Game;
