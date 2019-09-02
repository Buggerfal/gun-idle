import starter from "../engine/Starter";
import GraphicsHelper from "../utils/GraphicsHelper";
import appSettings from "../settings/appSettings";
import ScoreBar from "../components/ScoreBar";

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
                ScoreBar.show();
            },
        });
        this._substrate.setParent(this._container);
        this._substrate.alpha = 0.5;

        const substrateWidth = 800;
        const substrateHeight = 700;

        const rect = GraphicsHelper.drawGraphics({
            x: width / 2 - substrateWidth / 2,
            y: 300,
            width: substrateWidth,
            height: substrateHeight,
            color: `0x696969`,
            rounded: 100,
        });
        rect.setParent(this._container);

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

        ScoreBar.hide();
    }

    hide(e) {
        this._container.alpha = 0;
        this._substrate.interactive = false;
    }

    _runAnimation() {}
}

export default OutroScene;
