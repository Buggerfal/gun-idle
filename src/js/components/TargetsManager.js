import GraphicsHelper from "../utils/GraphicsHelper";
import Target from "./Target";
import TWEEN from "tween.js";
import Utils from "../utils/utils";

class TargetsManager {
    constructor(x, reward) {
        this._container = null;

        this._target1 = null;
        this._target2 = null;
        this._reward = reward;
        this._init(x);
    }

    _init(x) {
        this._container = GraphicsHelper.createContainer({
            x,
        });

        this.updateTargets();
    }

    get container() {
        return this._container;
    }

    makeHole(coordinates) {
        const { x, y } = this._container;
        this._target1.makeHole({
            x: coordinates.x - x,
            y: coordinates.y - y,
        });
    }

    createTarget() {
        const target = new Target({
            x: 150,
            y: 0,
            reward: this._reward,
        });
        target.container.setParent(this._container);

        target.on("destroy", () => {
            this._target1 = null;
            this.updateTargets();
            this._container.removeChild(target.container);
        });
        return target;
    }

    updateTargets() {
        if (!this._target2) {
            this._target2 = this.createTarget();
        }

        this._target1 = this._target2;

        this._targetTween = new TWEEN.Tween(this._target1.container)
            .to({ x: 0 }, 180)
            .start()
            .onComplete(x => {
                this._target2 = this.createTarget();
            });
    }

    getHolePosition() {
        const { width, height } = this._target1.container;
        const { x, y } = this._container;

        const xShift = Utils.random(width * 0.1, width * 0.55);
        const yShift = Utils.random(height * 0.2, height * 0.55);
        return {
            x: xShift + x,
            y: yShift + y,
        };
    }
}

export default TargetsManager;
