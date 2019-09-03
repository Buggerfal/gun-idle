import starter from "./Starter";

class Resizable {
    constructor() {
        starter.on("onResize", data => {
            this.onResize(data);
        });
    }

    onResize(data) {}
}

export default Resizable;
