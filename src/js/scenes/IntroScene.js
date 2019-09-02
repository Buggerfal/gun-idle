import starter from "../engine/Starter";
import GraphicsHelper from "../utils/GraphicsHelper";
import appSettings from "../settings/appSettings";
import Emitter from "component-emitter";
import Hint from "../components/Hint";

class IntroScene {
    constructor() {
        this._container = null;
        this._substrate = null;
        this._hintTween = null;

        new Emitter(this);

        this.init();
    }

    init() {
        const { width, height } = { ...appSettings.app };
        const textStyles = {
            fill: "white",
            fontFamily: "Courier New",
            fontSize: 200,
            fontWeight: 900,
        };

        this._container = GraphicsHelper.createContainer({});
        this._container.setParent(starter.app.stage);

        this._substrate = GraphicsHelper.drawGraphics({
            width,
            height,
            onClick: e => {
                e.stopPropagation();
                this.hide();
            },
        });
        this._substrate.setParent(this._container);
        this._substrate.alpha = 0.5;

        GraphicsHelper.drawText({
            x: width / 2,
            y: height / 2,
            text: `TAP TO`,
            style: textStyles,
        }).setParent(this._container);

        GraphicsHelper.drawText({
            x: width / 2,
            y: height / 2 + 220,
            text: `PLAY`, //TODO config
            style: textStyles,
        }).setParent(this._container);

        this.hide();
    }

    show() {
        this._runHint();

        this._container.alpha = 1;
        this._substrate.interactive = true;
    }

    hide() {
        this._container.alpha = 0;
        this._substrate.interactive = false;
    }

    _runHint() {
        const { height } = { ...appSettings.app };
        const hint = new Hint({ x: 250, y: height - 180 });

        this._container.addChild(hint.sprite);
    }
}

export default IntroScene;
