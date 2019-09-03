import WEAPONS from "../components/weapons/Constants";

export default [
    {
        name: `Colt 1911`,
        weaponType: WEAPONS.colt,
        gameProgressToUnlock: 0,
        level: `1`,
        shotReward: 20,
        openLevelCost: 0,
    },
    {
        name: `AK-47`,
        weaponType: WEAPONS.ak47,
        gameProgressToUnlock: 5,
        level: `2`,
        shotReward: 40,
        openLevelCost: 100,
    },
    {
        name: `no name`,
        weaponType: WEAPONS.colt,
        gameProgressToUnlock: 500,
        level: `3`,
        shotReward: 100,
        openLevelCost: 1000,
    },
    {
        name: `no name`,
        weaponType: WEAPONS.colt,
        gameProgressToUnlock: 5,
        level: `10`,
        shotReward: 300,
        openLevelCost: 10000,
    },
];
