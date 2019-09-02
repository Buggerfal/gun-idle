import starter from "../engine/Starter";
import GraphicsHelper from "../utils/GraphicsHelper";
import appSettings from "../settings/appSettings";
import ScoreBar from "../components/ScoreBar";
import Button from "../components/Button";
import i18n from "../settings/i18n";

class OutroScene {
    constructor() {
        this._container = null;
        this._substrate = null;

        this.init();
    }

    init() {
        const { width, height } = { ...appSettings.app };

        this._container = GraphicsHelper.createContainer({});
        this._container.setParent(starter.app.stage);

        this._substrate = GraphicsHelper.drawGraphics({
            width,
            height,
        });
        this._substrate.setParent(this._container);
        this._substrate.alpha = 0.5;

        const substrateWidth = 800;

        const { substrateOutro, installButton } = appSettings.colors;

        const rect = GraphicsHelper.drawGraphics({
            x: width / 2 - substrateWidth / 2,
            y: 300,
            width: substrateWidth,
            height: 700,
            color: substrateOutro,
            rounded: 100,
        });
        rect.setParent(this._container);

        GraphicsHelper.drawText({
            x: width / 2,
            y: 380,
            text: i18n.outroHeader,
            style: {
                fill: "white",
                fontFamily: "Courier New",
                fontSize: 70,
                fontWeight: 900,
            },
        }).setParent(this._container);

        this._weaponContainer = GraphicsHelper.createContainer({
            x: width / 2,
            y: 550,
        });
        this._weaponContainer.setParent(this._container);

        const shotGun = GraphicsHelper.createSpriteFromAtlas({
            x: 0,
            y: 0,
            anchor: 0.5,
            name: `shotgun`,
        });
        shotGun.setParent(this._weaponContainer);

        const shotGunRefresh = GraphicsHelper.createSpriteFromAtlas({
            x: 150,
            y: 0,
            anchor: 0.5,
            name: `shotgunRefresh`,
        });
        shotGunRefresh.setParent(this._weaponContainer);

        const shotGunSlide = GraphicsHelper.createSpriteFromAtlas({
            x: -8,
            y: -32,
            anchor: 0.5,
            name: `shotgunSlide`,
        });
        shotGunSlide.setParent(this._weaponContainer);

        GraphicsHelper.drawText({
            x: width / 2,
            y: 940,
            text: i18n.outroDescription,
            style: {
                fill: "white",
                fontFamily: "Courier New",
                fontSize: 50,
                fontWeight: 900,
            },
        }).setParent(this._container);

        this._ctaDownload = new Button({
            width: 350,
            height: 150,
            color: installButton,
            text: i18n.installButton,
            onClick: () => {
                this._ctaHandler();
            },
            fontSize: 70,
        });
        const ctaContainer = this._ctaDownload.container;

        ctaContainer.position.set(width / 2 - 175, 700);
        ctaContainer.setParent(this._container);

        this.hide();
    }

    show() {
        this._container.alpha = 1;
        this._substrate.interactive = true;

        ScoreBar.hide();
    }

    hide() {
        this._container.alpha = 0;
        this._container.visible = false;

        this._substrate.interactive = false;
    }

    _ctaHandler() {
        console.log(i18n.download);
    }
}

export default OutroScene;
