export default {
    alpha: {
        start: 0.31,
        end: 1,
    },
    scale: {
        start: 0.3,
        end: 1.5,
        minimumScaleMultiplier: 0.5,
    },
    speed: {
        start: 300,
        end: 500,
        minimumSpeedMultiplier: 2,
    },
    acceleration: {
        x: 0,
        y: 0,
    },
    maxSpeed: 3,
    startRotation: {
        min: -6,
        max: 6,
    },
    noRotation: true,
    rotationSpeed: {
        min: 0,
        max: 20,
    },
    lifetime: {
        min: 1.8,
        max: 2,
    },
    blendMode: "normal",
    frequency: 0.25,
    emitterLifetime: -1,
    maxParticles: 500,
    pos: {
        x: 0,
        y: 0,
    },
    addAtBack: false,
    spawnType: "point",
};
