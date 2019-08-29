import starter from "../Starter";
import GraphicsHelper from "../GraphicsHelper";
import appSettings from "../settings/appSettings";

class ScoreBar {
    constructor() {
        this._container = null;
        this._mainBackground = null;
        this._settingsIcon = null;
        this._moneyContainer = null;
        this._moneyBackground = null;
        this._moneyText = null;
        this._costText = null;

        this._config = { ...appSettings.score };
    }

    init() {
        const { width, height, mainBgColor, moneyBgColor } = this._config;

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

        this._settingsIcon = GraphicsHelper.createSpriteFromAtlas({
            x: 50,
            y: 50,
            name: `setting`,
        });
        this._settingsIcon.setParent(this._container);

        this._moneyContainer = GraphicsHelper.createContainer({
            x: 200,
            y: 0,
        });
        this._moneyContainer.setParent(starter.app.stage);

        this._moneyBackground = GraphicsHelper.createColorContainer({
            x: 0,
            y: 0,
            width: 400,
            height: 220,
            color: moneyBgColor,
        });
        this._moneyBackground.setParent(this._moneyContainer);

        this._moneyText = GraphicsHelper.drawText({
            x: 50,
            y: 20,
            text: `$0`,
            style: {
                fill: "white",
                fontFamily: "Comic Sans MS",
                fontSize: 110,
            },
        });
        this._moneyText.setParent(this._moneyContainer);

        this._costText = GraphicsHelper.drawText({
            x: 50,
            y: 140,
            text: `$3/s`,
            style: {
                fill: "gray",
                fontFamily: "Comic Sans MS",
                fontSize: 55,
            },
        });
        this._costText.setParent(this._moneyContainer);
    }
}

export default new ScoreBar();
