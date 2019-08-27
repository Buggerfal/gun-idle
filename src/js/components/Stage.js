import starter from "../Starter";
import GraphicsHelper from "../GraphicsHelper";
import settings from "../settings/settings";

class Stage {
    constructor(color) {
        this.container = null;

        this.size = { ...settings.app };

        this._init(color);
    }

    _init(color) {
        this.container = GraphicsHelper.createColorContainer({
            x: 0,
            y: 0,
            width: this.size.width,
            height: 200,
            color: color,
        });
        this.container.setParent(starter.app.stage);
    }
}

export default Stage;
