import starter from "./Starter";

class Resizable {
    constructor() {
        starter.on("onResize", data => {
            // const orientation =
            //     data.w > data.h
            //         ? Resizable.orientation.LANDSCAPE
            //         : Resizable.orientation.PORTRAIT;
            this.onResize(data);
        });

        //this.onResize();
    }

    onResize(data) {}
}

// Resizable.orientation = {
//     LANDSCAPE: "l",
//     PORTRAIT: "2",
// };

export default Resizable;
