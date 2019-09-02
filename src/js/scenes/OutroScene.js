import starter from "../engine/Starter";
import GraphicsHelper from "../utils/GraphicsHelper";
import appSettings from "../settings/appSettings";

class OutroScene {
    constructor() {
        this._container = null;
        this._substrate = null;

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

        this._container = GraphicsHelper.createContainer({
            x: 0,
            y: 0,
        });
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

        const rect = GraphicsHelper.drawGraphics({
            width: width / 3,
            color: `0x99ff00`,
            height,
        });
        rect.setParent(this._container);
        // rect.alpha = 1;

        // GraphicsHelper.drawText({
        //     x: width / 2,
        //     y: height / 2,
        //     text: `TAP TO`,
        //     style: textStyles,
        // }).setParent(this._container);

        // GraphicsHelper.drawText({
        //     x: width / 2,
        //     y: height / 2 + 220,
        //     text: `PLAY`,
        //     style: textStyles,
        // }).setParent(this._container);

        this.hide();
    }

    show() {
        this._container.alpha = 1;
        this._substrate.interactive = true;
        this._runAnimation();
    }

    hide(e) {
        this._container.alpha = 0;
        this._substrate.interactive = false;
    }

    _runAnimation() {}
}

export default OutroScene;
