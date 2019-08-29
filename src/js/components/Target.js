import GraphicsHelper from "../utils/GraphicsHelper";

class Target {
    constructor(config) {
        this._config = { ...config };
        this._container = null;

        this._lives = 10;

        this._init();
    }

    _init() {
        const { x, y, owner } = this._config;
        this._target = GraphicsHelper.createSpriteFromAtlas({
            x,
            y,
            name: `target`,
        });
        this._target.scale.set(1.4);
        this._target.setParent(owner);
    }
}

export default Target;
