import starter from "../engine/Starter";
import GraphicsHelper from "../utils/GraphicsHelper";
import appSettings from "../settings/appSettings";
import TWEEN from "tween.js";
import * as PIXI from "pixi.js";

class IntroScene {
    constructor() {
        this._container = null;
        this._substrate = null;
        this._hintText = null;
        this._hand = null;

        this._sizes = { ...appSettings.app };

        this._ticker = new PIXI.Ticker();
        this._ticker.start();
        this._ticker.add(() => {
            TWEEN.update();
        });
    }

    init() {
        const { width, height } = this._sizes;

        this._container = GraphicsHelper.createContainer({
            x: 0,
            y: 0,
        });
        this._container.setParent(starter.app.stage);

        this._substrate = GraphicsHelper.drawGraphics({
            width,
            height,
            onClick: e => {
                this.hide(e);
            },
        });
        this._substrate.setParent(this._container);
        this._substrate.alpha = 0.5;

        this._hintText = GraphicsHelper.drawText({
            x: width / 2,
            y: height / 2,
            text: `TAP TO PLAY`,
            style: {
                fill: "white",
                fontFamily: "Courier New",
                fontSize: 140,
                fontWeight: 900,
            },
        });

        this._hintText.setParent(this._container);

        this._hand = GraphicsHelper.createSpriteFromAtlas({
            x: 250,
            y: height - 180,
            name: `hand`,
        });
        this._hand.scale.set(1.6);
        this._hand.setParent(this._container);

        this._runHint();
    }

    show() {
        this._substrate.interactive = true;
    }

    hide(e) {
        e.stopPropagation();

        this._container.alpha = 0;
        this._substrate.interactive = false;
    }

    _runHint() {
        this._hand = new TWEEN.Tween(this._hand.pivot)
            .to({ x: -40, y: 40 }, 500)
            .yoyo(true)
            .repeat(Infinity)
            .start();
    }
}

export default IntroScene;
