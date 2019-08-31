import * as PIXI from "pixi.js";
import WeaponDescription from "../utils/ImagesDescriptions";

const spriteSheetName = "SpriteSheet.png";
const debug = false;

class TexturesLoader {
    ensureLoaded() {
        const textureInCache = PIXI.utils.TextureCache[spriteSheetName];
        if (textureInCache) {
            return Promise.resolve(textureInCache);
        }

        return this._load();
    }

    getByName(name) {
        const cached = PIXI.utils.TextureCache[name];
        if (cached) {
            debug && console.info(`texture '${name}' has been read from cache`);
            return cached;
        }

        const spriteSheet = PIXI.utils.TextureCache[spriteSheetName];
        const { x, y, width, height } = { ...WeaponDescription[name] };
        const rectangle = new PIXI.Rectangle(x, y, width, height);
        const texture = spriteSheet.clone();

        texture.frame = rectangle;

        debug && console.info(`texture '${name}' has been added to cache`);

        PIXI.Texture.addToCache(texture, name);

        return texture;
    }

    // TODO: review logic and try to use some well-known loading algorithm
    _load() {
        const texture = new PIXI.Texture.from("SpriteSheet.png");

        // texture has been loaded immediately
        // as it has been loaded to browser's cache
        if (texture.valid) {
            return Promise.resolve(texture);
        }

        // HACK: 'update' event fires once after texture's been loaded
        return new Promise((resolve, reject) => {
            texture.baseTexture.on("update", () => {
                debug &&
                    console.log(
                        "[TexturesLoader] texture has been loaded successfully"
                    );
                resolve(texture);
            });

            texture.baseTexture.on("error", () => {
                debug &&
                    console.error("[TexturesLoader] texture loading failed");
                reject();
            });
        });
    }
}

export default new TexturesLoader();
