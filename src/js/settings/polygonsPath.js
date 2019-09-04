import appSettings from "./appSettings";

const getPolygon = () => {
    const offset1 = 200;
    const offset2 = 150;
    const width = window.innerWidth;
    const height = appSettings.score.height;

    const polygon = [
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
    ];
    return polygon;
};
export default getPolygon();
// export default {
//     scoreBar: [
//         0,
//         0,
//         width,
//         0,
//         width,
//         height,
//         width / 2 + offset1,
//         height,
//         width / 2 + offset2,
//         height + 50,
//         width / 2 - offset2,
//         height + 50,
//         width / 2 - offset1,
//         height,
//         0,
//         height,
//         0,
//         0,
//     ],
// };
