import GraphicsHelper from "../utils/GraphicsHelper";
import Target from "./Target";
import TWEEN from "tween.js";
import Utils from "../utils/utils";
import Emitter from "component-emitter";
import starter from "../engine/Starter";
import appSettings from "../settings/appSettings";

class TargetsManager {
    constructor(config) {
        this._container = null;

        this._target1 = null;
        this._target2 = null;
        this._config = config;
        //TODO: bonusManager, not stupid logic
        this._isFirstTarget = true;
        this._init(config);

        new Emitter(this);
    }

    _init(config) {
        const { x } = config;
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
        const level = this._config.level;
        let name = `target`;

        //TODO: refactoring
        if (level === `2` && this._isFirstTarget) {
            name = `flameTarget`;
            this._isFirstTarget = false;
        }

        const target = new Target({
            x: 150,
            y: 0,
            name: name,
        });
        target.container.setParent(this._container);

        target.on("destroy", () => {
            this._target1 = null;
            this.updateTargets();
            this._container.removeChild(target.container);

            //TODO: refactoring
            if (name === `flameTarget`) {
                this.emit("rageMode");
            }
        });
        return target;
    }

    updateTargets() {
        if (!this._target2) {
            this._target2 = this.createTarget();
        }

        this._target1 = this._target2;

        this._targetTween = new TWEEN.Tween(this._target1.container)
            .to({ x: 0 }, 80)
            .start()
            .onComplete(x => {
                this._target2 = this.createTarget();
            });
    }

    setBonusTarget() {}

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
