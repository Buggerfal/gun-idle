import starter from "../engine/Starter";
import GraphicsHelper from "../utils/GraphicsHelper";
import appSettings from "../settings/appSettings";
import Button from "./Button";

class ScoreBar {
    constructor() {
        this._container = null;
        this._mainBackground = null;
        this._moneyText = null;
        this._ctaDownload = null;
        this._money = 0;

        this._config = { ...appSettings.score };
    }

    init() {
        const { width, height, mainBgColor } = this._config;

        this._container = GraphicsHelper.createContainer({
            x: 0,
            y: 0,
        });
        this._container.setParent(starter.app.stage);

        this._mainBackground = GraphicsHelper.createColorContainer({
            x: 0,
            y: 0,
            width: width,
            height: height,
            color: mainBgColor,
        });
        this._mainBackground.setParent(this._container);

        this._moneyText = GraphicsHelper.drawText({
            x: width / 2,
            y: height / 2,
            // text: `$${this._money}`,
            style: {
                fill: "white",
                fontFamily: "Comic Sans MS",
                fontSize: 110,
            },
        });
        this._moneyText.setParent(this._container);
        this.update();

        this._ctaDownload = new Button({
            x: width - 350,
            y: 50,
            width: 300,
            height: 100,
            color: "0xf902ff",
            text: `INSTALL`,
            onClick: () => {
                this._ctaHandler();
            },
            fontSize: 70,
        });
    }

    update(val = 0) {
        this._money += val;
        this._moneyText.text = `$${this._money}`;
    }

    _ctaHandler() {
        console.log("DOWNLOAD");
    }
}

export default new ScoreBar();
