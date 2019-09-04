import starter from "../engine/Starter";
import GraphicsHelper from "../utils/GraphicsHelper";
import appSettings from "../settings/appSettings";
import Emitter from "component-emitter";
import ScoreBar from "../components/ScoreBar";
import i18n from "../settings/i18n";
import Resizable from "../engine/Resizable";

class IntroScene extends Resizable {
    constructor() {
        super();

        this._container = null;
        this._substrate = null;
        this._hintTween = null;

        new Emitter(this);

        this._drwaAllElements();
        this.hide();
    }

    onResize(data) {
        const { w, h } = data;
        this._container.removeChildren();
        this._drwaAllElements();
    }

    _drawSubstrate() {}

    _drwaAllElements() {
        const { innerWidth: w, innerHeight: h } = window;

        const textStyles = {
            fill: "white",
            fontSize: 200,
            fontWeight: 900,
        };

        this._container = GraphicsHelper.createContainer({});
        this._container.setParent(starter.app.stage);

        this._substrate = null;
        this._substrate = GraphicsHelper.drawGraphics({
            width: w,
            height: h,
            onClick: e => {
                this.hide();
                ScoreBar.show();
                e.stopPropagation();
            },
        });
        this._substrate.setParent(this._container);
        this._substrate.alpha = 0.3;

        GraphicsHelper.drawText({
            x: w / 2,
            y: h / 2,
            text: i18n.introScene_1,
            style: textStyles,
        }).setParent(this._container);

        GraphicsHelper.drawText({
            x: w / 2,
            y: h / 2 + 220,
            text: i18n.introScene_2,
            style: textStyles,
        }).setParent(this._container);
    }

    show() {
        this._container.alpha = 1;
        this._substrate.interactive = true;
    }

    hide() {
        this._container.alpha = 0;
        this._substrate.interactive = false;
    }
}

export default IntroScene;
