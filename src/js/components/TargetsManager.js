import GraphicsHelper from "../utils/GraphicsHelper";
import Target from "./Target";
import starter from "../engine/Starter";
import TWEEN from "tween.js";

class TargetsManager {
    constructor(config) {
        this._config = { ...config };
        this._container = null;

        this._target1 = null;
        this._target2 = null;

        this._init();
    }

    _init() {
        const { x, y } = this._config;
        this._container = GraphicsHelper.createContainer({
            x,
            y,
        });
        this._container.setParent(starter.app.stage);

        this.updateTargets();
    }

    makeHole(y) {
        this._target1.makeHole(y);
    }

    createTarget() {
        const target = new Target({
            x: 0,
            y: 50,
            owner: this._container,
        });
        target.on("destroyTarget", () => {
            this._target1 = null;
            this.updateTargets();
        });
        return target;
    }

    updateTargets() {
        if (!this._target2) {
            this._target2 = this.createTarget();
        }

        this._target1 = this._target2;

        this._targetTween = new TWEEN.Tween(this._target1.sprite.pivot)
            .to({ x: 0 }, 180)
            .start()
            .onComplete(x => {
                this._target2 = this.createTarget();
            });
    }
}

export default TargetsManager;
