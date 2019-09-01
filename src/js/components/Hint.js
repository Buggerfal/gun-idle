import GraphicsHelper from "../utils/GraphicsHelper";
import TWEEN from "tween.js";

class Hint {
    constructor(coordinates) {
        this._sprite = null;
        this._init(coordinates);
    }

    _init(coordinates) {
        const { x, y } = { ...coordinates };

        this._sprite = GraphicsHelper.createSpriteFromAtlas({
            x,
            y,
            name: `hand`,
        });
        this._sprite.scale.set(1.6);

        this._hintTween = new TWEEN.Tween(this._sprite.pivot)
            .to({ x: -40, y: 40 }, 500)
            .yoyo(true)
            .repeat(Infinity)
            .start();
    }

    get sprite() {
        return this._sprite;
    }

    hide() {}

    show() {}
}

export default Hint;
