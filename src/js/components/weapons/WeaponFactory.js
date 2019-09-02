import { AK47, Colt1911, BaseWeapon } from "./Weapons";
import WEAPONS from "./Constants";

export default class WeaponFactory {
    static createWeapon(type, config) {
        switch (type) {
            case WEAPONS.ak47:
                return new AK47(config);
            case WEAPONS.colt:
                return new Colt1911(config);
            default:
                console.error(`Weapon ${type} not found`);
                return new BaseWeapon(config);
        }
    }
}
