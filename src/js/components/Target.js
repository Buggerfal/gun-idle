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

    makeHole() {
        const { x, owner } = this._config;

        if (this._lives <= 0) {
            owner.removeChildren();
            return;
        }

        const initXposition = x + Math.floor(Math.random() * 85 + 15);
        const initYposition = scrollY + Math.floor(Math.random() * 135 + 50);

        const hole = GraphicsHelper.createSpriteFromAtlas({
            x: initXposition,
            y: initYposition,
            name: `hole`,
        });
        hole.scale.set(0.3);
        hole.setParent(owner);

        this._lives -= 1;
    }
}

export default Target;
