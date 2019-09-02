import GraphicsHelper from "../utils/GraphicsHelper";
import starter from "../engine/Starter";

class Button {
    constructor(settings) {
        this._init(settings);
    }

    _init(settings) {
        const {
            x = 0,
            y = 0,
            width,
            height,
            color,
            text,
            onClick,
            fontSize,
        } = settings;

        this._spriteContainer = GraphicsHelper.createContainer();

        this._sprite = GraphicsHelper.drawGraphics({
            x: 0,
            y: 0,
            width,
            height,
            color,
            rounded: 15,
            onClick: onClick,
        });
        this._sprite.setParent(this._spriteContainer);

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

        this.text.setParent(this._sprite);
    }

    get container() {
        return this._spriteContainer;
    }

    hide() {
        this._sprite.alpha = 0;
        this._sprite.interactive = false;
    }

    show() {
        this._sprite.alpha = 1;
        this._sprite.interactive = true;
    }
}

export default Button;
