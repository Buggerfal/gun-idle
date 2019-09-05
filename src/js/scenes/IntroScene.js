import starter from "../engine/Starter";
import GraphicsHelper from "../utils/GraphicsHelper";
import appSettings from "../settings/appSettings";
import Emitter from "component-emitter";
import ScoreBar from "../components/ScoreBar";
import i18n from "../settings/i18n";
import Resizable from "../engine/Resizable";
import * as PIXI from "pixi.js";

class IntroScene extends Resizable {
    constructor() {
        super();

        this._container = null;
        this._substrate = null;
        this._hintTween = null;

        new Emitter(this);

        this.drawAllElements();
        this.hide();
    }

    onResize(data) {
        const { w, h } = data;

        //landscape
        if (w > h) {
            this._textHeader_1.y = h / 2 - 150;
            this._textHeader_2.y = h / 2 + 110;
        }

        //portrait
        if (w < h) {
            this._textHeader_1.y = h / 2 - 200;
            this._textHeader_2.y = h / 2 + 100;
        }

        this._textHeader_1.x = w / 2;
        this._textHeader_2.x = w / 2;

        this._substrate.width = w;
        this._substrate.height = h;
    }

    _drawSubstrate() {}

    drawText(settings) {
        const sourceTxt = `input your text`;
        const { text = sourceTxt, x = 0, y = 0, style } = settings;

        const txt = new PIXI.Text(text, style);
        txt.x = x;
        txt.y = y;
        txt.anchor.set(0.5);
        return txt;
    }

    drawAllElements() {
        const { innerWidth: w, innerHeight: h } = window;

        const textStyles = {
            fill: "white",
            fontSize: 200,
            fontWeight: 900,
        };

        this._container = GraphicsHelper.createContainer({});
        this._container.setParent(starter.app.stage);

        this._substrate = GraphicsHelper.createColorContainer({
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

        this._textHeader_1 = GraphicsHelper.drawText({
            x: w / 2,
            y: h / 2,
            text: i18n.introScene_1,
            style: textStyles,
        });
        this._textHeader_1.setParent(this._container);

        this._textHeader_2 = GraphicsHelper.drawText({
            x: w / 2,
            y: h / 2 + 220,
            text: i18n.introScene_2,
            style: textStyles,
        });
        this._textHeader_2.setParent(this._container);
    }

    show() {
        this._container.alpha = 1;
        this._substrate.visible = true;
    }

    hide() {
        this._container.alpha = 0;
        this._substrate.visible = false;
    }

    destroy() {}
}

export default IntroScene;
