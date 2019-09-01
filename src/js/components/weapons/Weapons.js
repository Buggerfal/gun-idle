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

        this._ticker = new PIXI.Ticker();
        this._ticker.start();

        this._ticker.add(delta => {
            this.tick(delta);
        });
        new Emitter(this);

        this.init();
    }

    init() {}

    hide() {}

    shot() {}

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

    hide() {
        this._container.alpha = 0;
        this._weaponContainer.interactive = false;
    }

    show() {
        this._container.alpha = 1;
        this._weaponContainer.interactive = true;
    }

    shot(coordinates) {
        this._bulletAnimation(coordinates);
        this._sleeveAnimation();
        this.emit("shotIsDone");
        this._weaponAnimation();

        this._fireAnimation();
    }

    _weaponAnimation() {
        this.rotationTween = new TWEEN.Tween(this._weaponContainer)
            .to({ rotation: [-0.17, 0] }, 80)
            .start();

        this.slideTween = new TWEEN.Tween(this._slideSprite.pivot)
            .to({ x: [45, 0] }, 80)
            .start();
    }

    _sleeveAnimation() {
        const sleeve = GraphicsHelper.createSpriteFromAtlas({
            x: 165,
            y: 60,
            name: `sleeve`,
        });
        sleeve.scale.set(0.4);
        sleeve.setParent(this._container);
        this.rotationTween = new TWEEN.Tween(sleeve)
            .to({ x: sleeve.x - Utils.random(100, 150), y: [-30, 0, 300] }, 180)
            .onUpdate(k => {
                sleeve.rotation = -k;
            })
            .onComplete(() => {
                this._container.removeChild(sleeve);
                sleeve.destroy();
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

    _fireAnimation() {
        const animatedSprite = new PIXI.AnimatedSprite([
            TexturesLoader.getByName(`fireAnimation_1`),
            TexturesLoader.getByName(`fireAnimation_2`),
        ]);
        animatedSprite.animationSpeed = 0.7;
        animatedSprite.loop = false;
        animatedSprite.position.set(
            this._mainSprite.x + 240,
            this._mainSprite.y - 30
        );
        animatedSprite.onComplete = () => {
            animatedSprite.destroy();
        };
        this._weaponContainer.addChild(animatedSprite);
        animatedSprite.play();
    }
}

export class AK47 extends BaseWeapon {
    constructor(config) {
        super(config);
    }

    init() {
        const { y } = this.config;
        const margin = 50;

        this._container = GraphicsHelper.createContainer({
            x: margin,
            y: y,
        });
        // this._container.setParent(starter.app.stage);

        this._container.on("pointerdown", () => {
            this.shot();
        });

        this._mainSprite = GraphicsHelper.createSpriteFromAtlas({
            x: margin,
            y: margin,
            name: `ak47`,
        });
        this._mainSprite.setParent(this._container);

        this._knife = GraphicsHelper.createSpriteFromAtlas({
            x: 400,
            y: 125,
            name: `ak47_knife`,
        });
        this._knife.setParent(this._container);

        this._slide = GraphicsHelper.createSpriteFromAtlas({
            x: 125,
            y: 67,
            name: `ak47_slide`,
        });
        this._slide.setParent(this._container);
    }

    hide() {
        this._container.alpha = 0;
        this._container.interactive = false;
    }

    show() {
        this._container.alpha = 1;
        this._container.interactive = true;
    }

    animated() {}
}
