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

        this._isGameStart = false;
    }

    onResize(data) {
        console.log("IntroScene - onResize");

        if (this._isGameStart) {
            return;
        }
        const { w, h } = data;

        const isLandscape = w > h;
        const holeX = isLandscape ? 150 : 30;
        const holeY = isLandscape ? h - h / 3 + 80 : h - h / 4 + 80;
        const holeWidth = isLandscape ? 350 : 250;
        const holeHeight = isLandscape ? 220 : 250;

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

        if (this._substrate) {
            this._substrate.clear();
            this._substrateContainer.removeChildren();
        }

        this._substrate = GraphicsHelper.drawHoleGraphics({
            width: w,
            height: h,
            holeX: holeX,
            holeY: holeY,
            holeWidth: holeWidth,
            holeHeight: holeHeight,
        });

        this._substrate.setParent(this._substrateContainer);
        this._substrate.alpha = 0.6;

        this._textHeader_1.x = w / 2;
        this._textHeader_2.x = w / 2;

        this._blockedInteractionGraphics = GraphicsHelper.drawGraphics({
            width: holeWidth,
            height: holeHeight,
            x: holeX,
            y: holeY,
            onClick: e => {
                e.stopPropagation();
                this.hide();
                ScoreBar.show();
                this._blockedInteractionGraphics.visible = false;
                this._isGameStart = true;
            },
        });
        this._blockedInteractionGraphics.setParent(this._substrateContainer);
        this._blockedInteractionGraphics.alpha = 0;
        this._blockedInteractionGraphics.interactive = true;
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

        this._substrateContainer = GraphicsHelper.createContainer();
        this._substrateContainer.setParent(starter.app.stage);

        this._container = GraphicsHelper.createContainer({});
        this._container.setParent(starter.app.stage);

        this._substrate = GraphicsHelper.drawHoleGraphics({
            width: w,
            height: h,
            holeX: 100,
            holeY: h - 300,
            holeWidth: 200,
            holeHeight: 200,
        });

        this._substrate.setParent(this._substrateContainer);
        this._substrate.alpha = 1;

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

        //this.onResize({ w, h });
    }

    show() {
        this._container.alpha = 1;
        this._substrate.visible = true;
        this._substrateContainer.visible = true;
    }

    hide() {
        this._container.alpha = 0;
        this._substrate.visible = false;
        this._substrateContainer.visible = false;
    }
}

export default IntroScene;
