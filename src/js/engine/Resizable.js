import starter from "./Starter";

class Resizable {
    constructor() {
        // starter.on("orientation_portrait", () => {
        //     this.onPortrait();
        // });

        // starter.on("orientation_landscape", () => {
        //     this.onLandscape();
        // });

        starter.on("onResize", data => {
            this.onResize(data);
        });
    }

    // onPortrait() {}
    // onLandscape() {}

    onResize(data) {
        //over right me
        console.log(12);
    }
}

export default Resizable;
