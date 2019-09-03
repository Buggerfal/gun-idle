import starter from "../engine/Starter";
import GraphicsHelper from "../utils/GraphicsHelper";
import appSettings from "../settings/appSettings";
import Emitter from "component-emitter";
import * as particles from "pixi-particles";
import ScoreBar from "../components/ScoreBar";
import i18n from "../settings/i18n";
import * as PIXI from "pixi.js";

class IntroScene {
    constructor() {
        this._container = null;
        this._substrate = null;
        this._hintTween = null;

        new Emitter(this);

        this.init();
        // this._particles(); //TODO:
    }

    init() {
        const { width, height } = { ...appSettings.app };
        const textStyles = {
            fill: "white",
            fontFamily: "Courier New",
            fontSize: 200,
            fontWeight: 900,
        };

        this._container = GraphicsHelper.createContainer({});
        this._container.setParent(starter.app.stage);

        this._substrate = GraphicsHelper.drawGraphics({
            width,
            height,
            holeX: 80,
            holeY: height - 280,
            holeWidth: 340,
            holeHeight: 240,
            onClick: e => {
                this.hide();
                ScoreBar.show();
                e.stopPropagation();
                this._container.removeChild(this._blockedInteractionGraphics);
            },
        });
        this._substrate.setParent(this._container);
        this._substrate.alpha = 0.5;

        //Block interaction in hole
        this._blockedInteractionGraphics = GraphicsHelper.drawGraphics({
            width: 340,
            height: 240,
            x: 80,
            y: height - 280,
            onClick: e => {
                this.hide();
                ScoreBar.show();
                this._blockedInteractionGraphics.visible = false;
                e.stopPropagation();
            },
        });
        this._blockedInteractionGraphics.setParent(this._container);
        this._blockedInteractionGraphics.alpha = 0;

        GraphicsHelper.drawText({
            x: width / 2,
            y: height / 2,
            text: i18n.introScene_1,
            style: textStyles,
        }).setParent(this._container);

        GraphicsHelper.drawText({
            x: width / 2,
            y: height / 2 + 220,
            text: i18n.introScene_2,
            style: textStyles,
        }).setParent(this._container);

        this.hide();
    }

    show() {
        this._container.alpha = 1;
        this._substrate.interactive = true;
    }

    hide() {
        this._container.alpha = 0;
        this._substrate.interactive = false;
    }

    _particles() {
        let container = new PIXI.ParticleContainer();
        container.x = 500;
        container.y = 500;

        starter.app.stage.addChild(container);

        // Circle
        const graphics = new PIXI.Graphics();

        graphics.lineStyle(0); // draw a circle, set the lineStyle to zero so the circle doesn't have an outline
        graphics.beginFill(0xde3249, 1);
        graphics.drawCircle(100, 250, 50);
        graphics.endFill();

        // this._container.addChild(graphics);

        const graphics2 = new PIXI.Graphics();

        graphics2.lineStyle(0); // draw a circle, set the lineStyle to zero so the circle doesn't have an outline
        graphics2.beginFill(0xde3249, 1);
        graphics2.drawCircle(100, 350, 25);
        graphics2.endFill();

        // this._container.addChild(graphics2);
        // for (let i = 0; i < 10; ++i) {
        //     let sprite = GraphicsHelper.createSpriteFromAtlas({
        //         name: `slide1911`,
        //     });
        //     container.addChild(sprite);
        // }

        let texture = starter.app.renderer.generateTexture(graphics);
        let texture3 = starter.app.renderer.generateTexture(graphics2);

        this._ticker = new PIXI.Ticker();
        this._ticker.start();
        this._ticker.add(() => {
            this._tick(this._ticker.deltaMS);
        });

        this.emitter = new particles.Emitter(container, [texture, texture3], {
            alpha: {
                start: 0,
                end: 1,
            },
            scale: {
                start: 0.3,
                end: 1.2,
                minimumScaleMultiplier: 1,
            },
            color: {
                start: "#6bff61",
                end: "#d8ff4a",
            },
            speed: {
                start: 50,
                end: 50,
                minimumSpeedMultiplier: 1,
            },
            acceleration: {
                x: 0,
                y: 0,
            },
            maxSpeed: 0,
            startRotation: {
                min: 0,
                max: 360,
            },
            noRotation: true,
            rotationSpeed: {
                min: 0,
                max: 0,
            },
            lifetime: {
                min: 2,
                max: 1.8,
            },
            blendMode: "screen",
            frequency: 0.01,
            emitterLifetime: -1,
            maxParticles: 10,
            pos: {
                x: 0.5,
                y: 0.5,
            },
            addAtBack: true,
            spawnType: "line",
            spawnCircle: {
                x: 100,
                y: 200,
                r: 120,
            },
        });

        this.emitter.emit = true;
    }

    _tick(delta) {
        this.emitter.update(delta);
    }
}

export default IntroScene;
