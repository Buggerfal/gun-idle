import GraphicsHelper from "../../utils/GraphicsHelper";
import TWEEN from "tween.js";
import * as PIXI from "pixi.js";
import Emitter from "component-emitter";
import TexturesLoader from "../../engine/TexturesLoader";
import Utils from "../../utils/utils";
import appSettings from "../../settings/appSettings";
import * as particles from "pixi-particles";
import particlesSettings from "../../settings/particles";
import starter from "../../engine/Starter";

export default class BaseWeapon {
    constructor(config) {
        this.config = { ...config };

        this._container = null;
        this._weaponContainer = null;

        this._weaponAnimationTime = 80;

        this._rageEmitters = [];

        new Emitter(this);

        this.init();

        this._isAnimationEnd = true;
    }

    init() {}

    hide() {
        this._container.alpha = 0;
        this._weaponContainer.interactive = false;
    }

    show() {
        this._container.alpha = 1;
        this._weaponContainer.interactive = true;
    }

    shot() {}

    sleeveAnimation() {
        const sleeve = GraphicsHelper.createSpriteFromAtlas({
            x: 190,
            y: 160,
            name: `sleeve`,
        });
        sleeve.scale.set(0.4);
        sleeve.setParent(this._container);

        this.rotationTween = new TWEEN.Tween(sleeve)
            .to({ x: sleeve.x - Utils.random(100, 150), y: [20, 300] }, 180)
            .onUpdate(k => {
                sleeve.rotation = -k;
            })
            .onComplete(() => {
                this._container.removeChild(sleeve);
                sleeve.destroy();
            })
            .start();
    }

    fireAnimation(positions) {
        const { x, y } = positions;

        const animatedSprite = new PIXI.AnimatedSprite([
            TexturesLoader.getByName(`fireAnimation_1`),
            TexturesLoader.getByName(`fireAnimation_2`),
        ]);
        animatedSprite.animationSpeed = 0.7;
        animatedSprite.loop = false;
        animatedSprite.position.set(
            this._mainSprite.x + x,
            this._mainSprite.y + y
        );
        animatedSprite.onComplete = () => {
            animatedSprite.destroy();
        };
        this._weaponContainer.addChild(animatedSprite);
        animatedSprite.play();
    }

    get container() {
        return this._container;
    }

    runRageModeAnimation() {
        for (let i = 0; i < 4; i++) {
            const color = Utils.getRandomColor();

            let container = new PIXI.ParticleContainer();

            this._container.addChild(container);

            container.x =
                this._weaponContainer.x +
                this._slideSprite.x +
                this._slideSprite.width;
            container.y = this._slideSprite.y + 170;

            const graphics = new PIXI.Graphics();

            graphics.lineStyle(0);
            graphics.beginFill(color, 1);
            graphics.drawCircle(100, 250, 50);
            graphics.endFill();

            const texture = starter.app.renderer.generateTexture(graphics);

            const emitter = new particles.Emitter(
                container,
                [texture],
                particlesSettings
            );

            const ticker = new PIXI.Ticker();
            ticker.start();
            ticker.add(() => {
                emitter.update(ticker.deltaMS * 0.003);
            });

            emitter.emit = true;

            this._rageEmitters.push(emitter);
        }

        this._weaponAnimationTime = 40;
    }

    stopRageModeAnimation() {
        this._rageEmitters.forEach(emitter => {
            emitter.emit = false;
        });
    }
}

export class Colt1911 extends BaseWeapon {
    constructor(config) {
        super(config);
    }

    init() {
        const { x, y } = { ...appSettings.weaponPosition };
        this._container = GraphicsHelper.createContainer({});

        this._weaponContainer = GraphicsHelper.createContainer({
            x,
            y,
        });
        this._weaponContainer.on("pointerdown", () => {
            this.emit("shotRequest");
        });
        this._weaponContainer.interactive = true;
        this._weaponContainer.setParent(this._container);

        this._mainSprite = GraphicsHelper.createSpriteFromAtlas({
            name: `colt1911`,
        });
        this._mainSprite.setParent(this._weaponContainer);

        this._slideSprite = GraphicsHelper.createSpriteFromAtlas({
            name: `slide1911`,
        });
        this._slideSprite.setParent(this._weaponContainer);
    }

    shot(coordinates) {
        if (!this._isAnimationEnd) {
            return;
        }

        this._isAnimationEnd = false;

        this.sleeveAnimation();
        this._bulletAnimation(coordinates);
        this._weaponAnimation();
        this.fireAnimation({
            x: 230,
            y: -20,
        });

        this.emit("shotIsDone");
    }

    _weaponAnimation() {
        //TODO: WEAPON POSITION

        this.rotationTween = new TWEEN.Tween(this._weaponContainer)
            .to({ rotation: [-0.17, 0] }, this._weaponAnimationTime)
            .start();

        this.slideTween = new TWEEN.Tween(this._slideSprite.pivot)
            .to({ x: [45, 0] }, this._weaponAnimationTime)
            .onComplete(() => {
                this._isAnimationEnd = true;
            })
            .start();
    }

    _bulletAnimation(coordinates) {
        const bullet = GraphicsHelper.createSpriteFromAtlas({
            x: this._weaponContainer.x + this._mainSprite.width,
            y: this._weaponContainer.y,
            name: `bullet`,
        });
        bullet.scale.set(0.3);
        bullet.setParent(this._container);

        new TWEEN.Tween(bullet)
            .to({ x: coordinates.x, y: coordinates.y + 100 }, 60)
            .onComplete(() => {
                bullet.destroy();
            })
            .start();
    }
}

export class AK47 extends BaseWeapon {
    constructor(config) {
        super(config);
    }

    init() {
        const { x, y } = { ...appSettings.weaponPosition };

        this._container = GraphicsHelper.createContainer({});

        this._weaponContainer = GraphicsHelper.createContainer({
            x,
            y,
        });
        this._weaponContainer.on("pointerdown", () => {
            this.emit("shotRequest");
        });
        this._weaponContainer.interactive = true;
        this._weaponContainer.setParent(this._container);

        this._mainSprite = GraphicsHelper.createSpriteFromAtlas({
            name: `ak47`,
        });
        this._mainSprite.setParent(this._weaponContainer);

        this._knife = GraphicsHelper.createSpriteFromAtlas({
            x: 350,
            y: 80,
            name: `ak47_knife`,
        });
        this._knife.setParent(this._weaponContainer);

        this._slideSprite = GraphicsHelper.createSpriteFromAtlas({
            x: 75,
            y: 18,
            name: `ak47_slide`,
        });
        this._slideSprite.setParent(this._weaponContainer);
    }

    shot(coordinates) {
        if (!this._isAnimationEnd) {
            return;
        }

        this._isAnimationEnd = false;

        this.sleeveAnimation();
        this._bulletAnimation(coordinates);
        this._weaponAnimation();
        this.fireAnimation({
            x: 420,
            y: 0,
        });

        this.emit("shotIsDone");
    }

    _weaponAnimation() {
        const endXPosition = this._weaponContainer.x;

        this.rotationTween = new TWEEN.Tween(this._weaponContainer)
            .to({ rotation: [-0.17, 0] }, this._weaponAnimationTime)
            .start();

        this.moveTween = new TWEEN.Tween(this._weaponContainer)
            .to({ x: [-20, endXPosition] }, this._weaponAnimationTime)
            .onComplete(() => {
                this._isAnimationEnd = true;
            })
            .start();

        this.slideTween = new TWEEN.Tween(this._slideSprite.scale)
            .to({ x: [1, 0, 1] }, this._weaponAnimationTime)
            .start();

        this.knifeRotationTween = new TWEEN.Tween(this._knife)
            .to(
                { rotation: [-0.3, 0.3, -0.2, 0.2, 0.1, 0.1, 0] },
                this._weaponAnimationTime * 2
            )
            .start();
    }

    _bulletAnimation(coordinates) {
        const bullet = GraphicsHelper.createSpriteFromAtlas({
            x: this._weaponContainer.x + this._mainSprite.width,
            y: this._weaponContainer.y + 60,
            name: `bullet`,
        });
        bullet.scale.set(0.3);
        bullet.setParent(this._container);

        new TWEEN.Tween(bullet)
            .to({ x: coordinates.x, y: coordinates.y + 100 }, 60)
            .onComplete(() => {
                bullet.destroy();
            })
            .start();
    }
}
