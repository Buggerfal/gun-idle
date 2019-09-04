import GraphicsHelper from "../utils/GraphicsHelper";
import TWEEN from "tween.js";

class Hint {
    constructor(coordinates) {
        this._sprite = null;
        this._init(coordinates);
    }

    _init(coordinates) {
        const { x, y } = { ...coordinates };

        this._container = GraphicsHelper.createContainer({ x, y });

        this._sprite = GraphicsHelper.createSpriteFromAtlas({
            name: `hand`,
        });
        this._sprite.scale.set(1.6);
        this._sprite.setParent(this._container);

        this._animation();

        this.show();
    }

    _animation() {
        this._hintTween = new TWEEN.Tween(this._sprite.scale)
            .to({ x: [2, 1.6], y: [2, 1.6] }, 1000)
            .onComplete(() => {
                this._animation();
            })
            .start();
    }

    get sprite() {
        return this._container;
    }

    hide() {
        this._container.alpha = 0;
    }

    show() {
        this._container.alpha = 1;
    }
}

export default Hint;
