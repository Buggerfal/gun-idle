import * as PIXI from "pixi.js";
// import texturesLoader from "../engine/TexturesLoader";
import IMAGES from "@images";

export default class GraphicsHelper {
    static createContainer(settings = {}) {
        const { x = 0, y = 0, width = 0, height = 0 } = settings;

        const container = new PIXI.Container();
        container.x = x;
        container.y = y;
        container.width = width;
        container.height = height;

        return container;
    }

    static createColorContainer(settings = {}) {
        const {
            x = 0,
            y = 0,
            width = 0,
            height = 0,
            color,
            onClick,
            alpha = 1,
        } = settings;

        const container = new PIXI.Container();

        // move container to screen center
        container.x = x;
        container.y = y;
        container.alpha = alpha;
        container.width = width;
        container.height = height;

        const sprite = new PIXI.Sprite(PIXI.Texture.WHITE);

        sprite.width = width;
        sprite.height = height;
        sprite.tint = color;
        sprite.setParent(container);

        if (onClick) {
            container.buttonMode = true;
            container.interactive = true;
            container.on("pointerdown", onClick);
        }

        return container;
    }

    static createSpriteFromAtlas(settings = {}) {
        // const { x = 0, y = 0, alpha = 1, name, anchor } = settings;
        // const texture = texturesLoader.getByName(name);
        // const sprite = new PIXI.Sprite(texture);
        // sprite.x = x;
        // sprite.y = y;
        // sprite.alpha = alpha;
        // if (anchor) {
        //     sprite.anchor.set(anchor);
        // }
        // return sprite;
    }

    static createSprite(settings) {
        const { name, x = 0, y = 0, onClick } = settings;

        const base64source = IMAGES[name];
        const texture = PIXI.Texture.fromLoader(base64source);
        const sprite = new PIXI.Sprite(texture);

        sprite.x = x;
        sprite.y = y;

        if (onClick) {
            sprite.buttonMode = true;
            sprite.interactive = true;
            sprite.on("pointerdown", onClick);
        }

        return sprite;
    }

    static drawText(settings) {
        const sourceTxt = `input your text`;
        const { text = sourceTxt, x = 0, y = 0, style } = settings;

        const txt = new PIXI.Text(text, style);
        txt.x = x;
        txt.y = y;
        txt.anchor.set(0.5);
        return txt;
    }

    static drawGraphics(settings) {
        const {
            color = 0x000000,
            x = 0,
            y = 0,
            width = 20,
            height = 20,
            rounded = 0,
            onClick,
            holeX = 0,
            holeY = 0,
            holeWidth = 0,
            holeHeight = 0,
        } = settings;

        const graphics = new PIXI.Graphics();

        graphics.beginFill(color);
        graphics.drawRoundedRect(x, y, width, height, rounded); //TODO Nine splice
        graphics.beginHole();
        graphics.drawRoundedRect(holeX, holeY, holeWidth, holeHeight, rounded);

        graphics.endHole();
        graphics.endFill();

        if (onClick) {
            graphics.buttonMode = true;
            graphics.interactive = true;
            graphics.on("pointerdown", onClick);
        }

        return graphics;
    }

    static drawPolygon(settings = {}) {
        const { color = 0x000000, path, alpha = 1 } = settings;

        const graphics = new PIXI.Graphics();

        graphics.lineStyle(0);
        graphics.beginFill(color, alpha);
        graphics.drawPolygon(path);
        graphics.endFill();

        return graphics;
    }
}
