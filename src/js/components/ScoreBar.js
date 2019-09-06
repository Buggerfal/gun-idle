import starter from "../engine/Starter";
import GraphicsHelper from "../utils/GraphicsHelper";
import appSettings from "../settings/appSettings";
import Button from "./Button";
import TWEEN from "tween.js";
import i18n from "../settings/i18n";
import polygonsPath from "../settings/polygonsPath";
import Resizable from "../engine/Resizable";
import * as PIXI from "pixi.js";

class ScoreBar extends Resizable {
    constructor() {
        super();
        this._container = null;
        this._moneyText = null;
        this._ctaDownload = null;
        this._money = 0;

        this._config = { ...appSettings.score };
    }

    onResize(data) {
        const { w, h } = data;
        const isLandscape = w > h;
        const btnX = isLandscape ? w - 350 : w - 310;

        if (this._backgroundPolygon) {
            this._backgroundPolygon.width = w;
            this._moneyText.x = w / 2;
            this._moneyText.y = 160;
            this._ctaDownload.container.position.set(btnX, 25);
        }
    }

    init() {
        const { width, height } = this._config;
        const { scoreBar } = appSettings.colors;

        const { innerWidth: w, innerHeight: h } = window;
        const scoreHeight = appSettings.score.height;

        this._container = GraphicsHelper.createContainer({});
        this._container.setParent(starter.app.stage);

        this._backgroundPolygon = GraphicsHelper.drawPolygon({
            path: polygonsPath,
            color: scoreBar,
        });

        this._container.addChild(this._backgroundPolygon);

        this._moneyText = GraphicsHelper.drawText({
            x: width / 2,
            y: height / 2,
            style: {
                fill: "white",
                fontSize: 90,
            },
        });
        this._moneyText.setParent(this._container);
        this.update();

        const { installButton } = appSettings.colors;

        this._ctaDownload = new Button({
            width: 300,
            height: 100,
            color: installButton,
            text: i18n.installButton,
            rounded: 25,
            onClick: () => {
                this._ctaHandler();
            },
            fontSize: 70,
        });
        this._ctaDownload.container.position.set(w - 290, 50);
        this._ctaDownload.container.setParent(this._container);

        new TWEEN.Tween(this._container.pivot).to({ y: 250 }, 0).start();

        this._container.visible = false;

        setTimeout(() => {
            this.onResize({ w, h: scoreHeight });
        }, 100);
    }

    onLandscape() {
        console.log("LANDSCAPE");
    }

    onPortrait() {
        console.log("PORTRAIT");
    }

    update(val = 0) {
        this._money += val;

        this._moneyText.text = `${i18n.usdIcon}${this._money}`;
    }

    get money() {
        return this._money;
    }

    show() {
        console.info("scoreBar - show");

        new TWEEN.Tween(this._container.pivot).to({ y: 0 }, 260).start();
        this._container.visible = true;
    }

    hide() {
        new TWEEN.Tween(this._container.pivot).to({ y: 300 }, 260).start();
    }

    _ctaHandler() {
        console.log(i18n.download);
    }
}

export default new ScoreBar();
