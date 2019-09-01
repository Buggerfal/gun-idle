import GraphicsHelper from "../../utils/GraphicsHelper";
import TWEEN from "tween.js";
import * as PIXI from "pixi.js";
import Emitter from "component-emitter";
import TexturesLoader from "../../engine/TexturesLoader";
import Utils from "../../utils/utils";
import appSettings from "../../settings/appSettings";

export default class BaseWeapon {
    constructor(config) {
        this.config = { ...config };

        this._container = null;
        this._weaponContainer = null;

        this._ticker = new PIXI.Ticker();
        this._ticker.start();

        this._ticker.add(delta => {
            this.tick(delta);
        });
        new Emitter(this);

        this.init();
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

    tick() {}
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
        this._bulletAnimation(coordinates);
        this.sleeveAnimation();
        this.emit("shotIsDone");
        this._weaponAnimation();

        this.fireAnimation({
            x: 230,
            y: -20,
        });

        this.emit("timerStart");
    }

    _weaponAnimation() {
        this.rotationTween = new TWEEN.Tween(this._weaponContainer)
            .to({ rotation: [-0.17, 0] }, 80)
            .start();

        this.slideTween = new TWEEN.Tween(this._slideSprite.pivot)
            .to({ x: [45, 0] }, 80)
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
        this.sleeveAnimation();
        this.fireAnimation({
            x: 420,
            y: 0,
        });

        this._bulletAnimation(coordinates);
        this.emit("timerStart");
        this.emit("shotIsDone");
        this._weaponAnimation();
    }

    _weaponAnimation() {
        const endXPosition = this._weaponContainer.x;

        this.rotationTween = new TWEEN.Tween(this._weaponContainer)
            .to({ rotation: [-0.17, 0] }, 80)
            .start();

        this.moveTween = new TWEEN.Tween(this._weaponContainer)
            .to({ x: [-20, endXPosition] }, 80)
            .start();

        this.slideTween = new TWEEN.Tween(this._slideSprite.scale)
            .to({ x: [1, 0, 1] }, 80)
            .start();

        this.knifeRotationTween = new TWEEN.Tween(this._knife)
            .to({ rotation: [-0.3, 0.3, -0.2, 0.2, 0.1, 0.1, 0] }, 180)
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

    animated() {}
}
