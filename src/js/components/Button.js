import GraphicsHelper from "../GraphicsHelper";
import starter from "../Starter";

class Button {
    constructor(settings) {
        this._init(settings);
    }

    _init(settings) {
        const {
            x,
            y,
            width,
            height,
            color,
            text,
            onClick,
            fontSize,
        } = settings;

        this._buttonContainer = GraphicsHelper.createContainer({
            x,
            y,
        });
        this._buttonContainer.setParent(starter.app.stage);

        this._button = GraphicsHelper.drawGraphics({
            x: 0,
            y: 0,
            width,
            height,
            color,
            rounded: 15,
            onClick: onClick,
        });
        this._button.setParent(this._buttonContainer);

        this.text = GraphicsHelper.drawText({
            x: width / 2,
            y: height / 2,
            text,
            style: {
                fill: "white",
                fontFamily: "Comic Sans MS",
                fontSize: fontSize,
                strokeThickness: 3,
            },
        });

        this.text.setParent(this._button);
    }

    hide() {
        this._button.alpha = 0;
        this._button.interactive = false;
    }

    show() {
        this._button.alpha = 1;
        this._button.interactive = true;
    }
}

export default Button;
