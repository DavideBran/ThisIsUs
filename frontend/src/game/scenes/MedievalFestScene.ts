import { BusEvents, eventBus } from "../../utils/EventBus";
import { DefaultAnimations, getFloatingTween } from "../animations";
import SceneWithInteractionModal from "./common/SceneWithInteractionModal";

export default class MedievalFestScene extends SceneWithInteractionModal {
  constructor() {
    super("MedievalFestScene");
  }

  private titleClosed = false;

  private triggerTitle() {
    eventBus.emit(BusEvents.SHOW_TITLE, "Medieval Fest");
    eventBus.on(BusEvents.TITLE_ANIMATION_END, () => (this.titleClosed = true));
  }

  private loadDoor() {
    const { width } = this.scale;
    const portal = this.physics.add.sprite(width / 2 - 40, 24, "portal");
    portal.setInteractive();

    this.anims.create({
      key: "portal-idle",
      frames: this.anims.generateFrameNumbers("portal", { start: 0, end: -1 }), // Use all frames
      frameRate: 10,
      repeat: -1, // Loop indefinitely
    });

    portal.play("portal-idle");
    const floatingTween = getFloatingTween(this.tweens, portal);
    portal.setData(DefaultAnimations.Floating, floatingTween);

    this.physics.add.overlap(this.player, portal, () => {
      const floatingTween = portal.getData(DefaultAnimations.Floating);
      if (floatingTween) {
        floatingTween.stop();
      }

      this.cameras.main.fadeOut(1000, 0, 0, 0);

      this.cameras.main.once("camerafadeoutcomplete", () => {
        this.scene.start("NewScene");
      });
    });
  }

  create() {
    this.triggerTitle();

    const { width, height } = this.scale;
    this.playerFactory(width / 2 + 192, height + 32);
  }

  update() {
    if (!this.titleClosed) return;

    if (!this.isModalOpen) {
      this.updatePlayer();
    } else if (Phaser.Input.Keyboard.JustDown(this.enterKey)) {
      this.hideModal();
    }
  }
}
