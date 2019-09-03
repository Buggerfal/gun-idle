export default class Utils {
    static random(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static getRandomColor() {
        return "0x" + ((Math.random() * 0xffffff) << 0).toString(16);
    }
}
