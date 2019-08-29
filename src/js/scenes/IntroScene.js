import starter from "../engine/Starter";
import GraphicsHelper from "../utils/GraphicsHelper";
import appSettings from "../settings/appSettings";

class IntroScene {
    constructor() {
        this._container = null;
        this._substrate = null;
        this._hintText = null;

        this._sizes = { ...appSettings.app };
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
                fontFamily: "Tahoma, Geneva, sans-serif",
                fontSize: 120,
            },
        });

        this._hintText.setParent(this._container);
    }

    show() {
        this._substrate.interactive = true;
    }

    hide(e) {
        e.stopPropagation();
        this._container.alpha = 0;
        this._substrate.interactive = false;
    }
}

export default IntroScene;
