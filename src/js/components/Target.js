import GraphicsHelper from "../utils/GraphicsHelper";
import TWEEN from "tween.js";
import * as PIXI from "pixi.js";
import starter from "../engine/Starter";
import Emitter from "component-emitter";
import Utils from "../utils/utils";

class Target {
    constructor(config) {
        this._config = { ...config };
        this._lives = 5;
        this._container = null;
        this._shakeAnimation = null;

        this._scale = 1.4;

        new Emitter(this);

        this._init();
    }

    _init() {
        const { x, y } = this._config;

        this._container = GraphicsHelper.createContainer({
            x,
            y,
        });

        this._target = GraphicsHelper.createSpriteFromAtlas({
            name: `target`,
        });
        this._target.scale.set(this._scale);
        this._target.setParent(this._container);
    }

    get container() {
        return this._container;
    }

    makeHole(verticalPosition) {
        this._lives -= 1;

        if (this._lives <= 0) {
            if (this._lives == 0) {
                this.destroy();
            }

            return;
        }

        const { width: w, height: h } = this._target;

        const x = Utils.random(w * 0.1, w * 0.55);
        const y = verticalPosition; //Utils.random(h * 0.2, h * 0.55);

        const hole = GraphicsHelper.createSpriteFromAtlas({
            x,
            y,
            name: `hole`,
        });
        hole.scale.set(0.3);
        hole.setParent(this._container);

        this._shake();
    }

    _shake() {
        this._shakeAnimation = new TWEEN.Tween(this._container)
            .to({ x: [-10, 0, 10, -5, 0, 5, 0] }, 180)
            .start();
    }

    _destroyAnimation() {
        this._target.alpha = 0;
        const animationsCompletions = [];

        const addAnimation = ({ x, y, name, tweenAnimationSettings }) => {
            const animation = GraphicsHelper.createSpriteFromAtlas({
                name,
                x,
                y,
            });

            animation.scale.set(this._scale);
            animation.setParent(this._container);

            animationsCompletions.push(
                new Promise(resolve => {
                    const sign = Utils.random(0, 1) === 0 ? -1 : 1;

                    new TWEEN.Tween(animation)
                        .to(tweenAnimationSettings, 180)
                        .onUpdate(k => {
                            //animation.rotation = k * 2 * sign;
                        })
                        .onComplete(() => {
                            resolve();
                        })
                        .start();
                })
            );
        };

        addAnimation({
            name: `targetDestroyAnimation_1`,
            x: 0,
            y: 5,
            tweenAnimationSettings: { x: -30, y: 300 },
        });

        addAnimation({
            name: `targetDestroyAnimation_2`,
            x: 30,
            y: 0,
            tweenAnimationSettings: { x: 80, y: 260 },
        });

        addAnimation({
            name: `targetDestroyAnimation_3`,
            x: 60,
            y: 75,
            tweenAnimationSettings: { x: 100, y: 290 },
        });

        addAnimation({
            name: `targetDestroyAnimation_4`,
            x: 20,
            y: 95,
            tweenAnimationSettings: { x: 20, y: 310 },
        });

        return Promise.all(animationsCompletions);
    }

    destroy() {
        this._destroyAnimation().then(() => {
            this.emit("destroy");
            this._container.removeChildren();
        });
        this._shakeAnimation.stop();
    }
}

export default Target;
