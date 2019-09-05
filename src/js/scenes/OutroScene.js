import starter from "../engine/Starter";
import GraphicsHelper from "../utils/GraphicsHelper";
import appSettings from "../settings/appSettings";
import ScoreBar from "../components/ScoreBar";
import Button from "../components/Button";
import i18n from "../settings/i18n";
import Resizable from "../engine/Resizable";

class OutroScene extends Resizable {
    constructor() {
        super();

        this._container = null;
        this._substrate = null;

        this.init();
    }

    onResize(data) {
        const { w, h } = data;

        //landscape
        if (w > h) {
        }

        //portrait
        if (h > w) {
        }

        if (this._substrate) {
            this._substrate.width = w;
            this._substrate.height = h;
            this._rect.x = w / 2 - this._rect.width / 2;
            this._rect.y = h / 2 - 350;
        }
    }

    init() {
        const { innerWidth: w, innerHeight: h } = window;

        this._container = GraphicsHelper.createContainer({});
        this._container.setParent(starter.app.stage);

        this._substrate = GraphicsHelper.createColorContainer({
            width: w,
            height: h,
        });

        this._substrate.setParent(this._container);
        this._substrate.alpha = 0.5;

        const { substrateOutro, installButton } = appSettings.colors;

        this._rect = GraphicsHelper.createColorContainer({
            x: w / 2 - 350,
            y: h / 2 - 350,
            width: 700,
            height: 600,
            color: substrateOutro,
        });
        this._rect.setParent(this._container);

        const headerText = GraphicsHelper.drawText({
            x: 350,
            y: 100,
            text: i18n.outroHeader,
            style: {
                fill: "white",
                fontSize: 70,
                fontWeight: 900,
            },
        });
        headerText.setParent(this._rect);

        this._weaponContainer = GraphicsHelper.createContainer({});
        this._weaponContainer.setParent(this._rect);

        const shotGun = GraphicsHelper.createSprite({
            x: 350,
            y: 250,
            anchor: 0.5,
            name: `shotgun`,
        });
        shotGun.setParent(this._weaponContainer);

        const shotGunRefresh = GraphicsHelper.createSprite({
            x: 450,
            y: 250,
            anchor: 0.5,
            name: `shotgunRefresh`,
        });
        shotGunRefresh.setParent(this._weaponContainer);

        const shotGunSlide = GraphicsHelper.createSprite({
            x: 290,
            y: 215,
            anchor: 0.5,
            name: `shotgunSlide`,
        });
        shotGunSlide.setParent(this._weaponContainer);

        const description = GraphicsHelper.drawText({
            x: 350,
            y: 530,
            text: i18n.outroDescription,
            style: {
                fill: "white",
                fontSize: 45,
                fontWeight: 900,
            },
        });
        description.setParent(this._rect);

        this._ctaDownload = new Button({
            width: 350,
            height: 150,
            color: installButton,
            text: i18n.installButton,
            rounded: 20,
            onClick: () => {
                this._ctaHandler();
            },
            fontSize: 70,
        });
        this._ctaDownload.container.setParent(this._rect);
        this._ctaDownload.container.position.set(170, 350);

        this.hide();
    }

    show() {
        this._substrate.interactive = true;
        this._container.visible = true;

        ScoreBar.hide();
    }

    hide() {
        this._container.visible = false;
        this._substrate.interactive = false;
    }

    _ctaHandler() {
        console.log(i18n.download);
    }
}

export default OutroScene;
