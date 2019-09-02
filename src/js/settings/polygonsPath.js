import appSettings from "./appSettings";

const offset1 = 200;
const offset2 = 150;
const width = appSettings.score.width;
const height = appSettings.score.height;

export default {
    scoreBar: [
        0,
        0,
        width,
        0,
        width,
        height,
        width / 2 + offset1,
        height,
        width / 2 + offset2,
        height + 50,
        width / 2 - offset2,
        height + 50,
        width / 2 - offset1,
        height,
        0,
        height,
        0,
        0,
    ],
};
