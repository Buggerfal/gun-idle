import "@styles";
import starter from "./enginee/Starter";
import Game from "./enginee/Game.js";

document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector(".content");
    if (container) {
        starter.init(container).then(() => {
            const game = new Game();
        });
    }
});
