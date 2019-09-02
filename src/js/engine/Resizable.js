import starter from "./Starter";

class Resizable {
    constructor() {
        starter.on("orientation_portrait", () => {
            this.onPortrait();
        });

        starter.on("orientation_landscape", () => {
            this.onLandscape();
        });
    }

    onPortrait() {}
    onLandscape() {}
}

export default Resizable;
