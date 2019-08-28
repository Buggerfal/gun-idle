import * as PIXI from "pixi.js";
import IMAGES from "@images";
import WeaponDescription from "./components/weapons/WeaponDescription";

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
        const { x = 0, y = 0, width = 0, height = 0, color } = settings;
        const container = new PIXI.Sprite(PIXI.Texture.WHITE);

        container.x = x;
        container.y = y;
        container.width = width;
        container.height = height;
        container.tint = color;

        return container;
    }

    static createSpriteFromAtlas(settings = {}) {
        // PIXI.utils.TextureCache[IMAGES[`SpriteSheet`]];
        const { x = 0, y = 0, name } = settings;
        const description = { ...WeaponDescription[name] };
        const base64source = IMAGES[`SpriteSheet`];
        const texture = PIXI.Texture.fromLoader(base64source);

        const rectangle = new PIXI.Rectangle(
            description.x,
            description.y,
            description.width,
            description.height
        );

        texture.frame = rectangle;

        const sprite = new PIXI.Sprite(texture);

        sprite.x = x;
        sprite.y = y;

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
        } = settings;

        const graphics = new PIXI.Graphics();
        graphics.beginFill(color, 1);
        graphics.drawRoundedRect(x, y, width, height, rounded);
        graphics.endFill();

        if (onClick) {
            graphics.buttonMode = true;
            graphics.interactive = true;
            graphics.on("pointerdown", onClick);
        }

        return graphics;
    }
}
