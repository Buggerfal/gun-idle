import "@styles";
import starter from "./engine/Starter";
import Game from "./engine/Game.js";

document.addEventListener("DOMContentLoaded", () => {
    // const container = document.querySelector(".content");
    // if (container) {
    starter.init().then(() => {
        const game = new Game();
    });
    // }
});
