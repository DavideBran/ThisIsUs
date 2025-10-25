import { BusEvents, eventBus } from "../../utils/EventBus";
import type { MapSettings } from "./common/BaseScene";
import SceneWithInteractionModal from "./common/SceneWithInteractionModal";

export default class StreetFoodScene extends SceneWithInteractionModal {
  private titleClosed = false;

  constructor() {
    super("StreetFoodScene");
  }

  private triggerTitle() {
    eventBus.emit(BusEvents.SHOW_TITLE, "Street Food");
    eventBus.on(BusEvents.TITLE_ANIMATION_END, () => (this.titleClosed = true));
  }

  private getMapPosition(mapX: number, mapY: number): { x: number; y: number } {
    const { width, height } = this.scale;
    const mapSettings = this.cache.json.get(
      "streetFoodCollision"
    ) as MapSettings;
    const { scale } = this.getScaledDisplaySize(mapSettings);

    const scaledX = mapX * scale;
    const scaledY = mapY * scale;
    const x = scaledX + width / 2 - (mapSettings.mapWidth * scale) / 2;
    const y = scaledY + height / 2 - (mapSettings.mapHeight * scale) / 2;

    return { x, y };
  }

  private loadObjects() {
    // #TODO Load objects
    console.log("loading objects");
  }

  create() {
    const { width, height } = this.scale;
    const mapSettings = this.cache.json.get(
      "streetFoodCollision"
    ) as MapSettings;
    const playerCoordinates = { x: width / 2, y: height };
    this.buildBackgroundWithColliders(mapSettings, playerCoordinates);
    this.loadObjects();
    this.triggerTitle();

    this.enterKey = this.input.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.ENTER
    );
  }

  update() {
    if (!this.titleClosed || this.fadingOut) return;

    if (!this.isModalOpen) {
      this.updatePlayer();
    } else if (Phaser.Input.Keyboard.JustDown(this.enterKey)) {
      this.hideModal();
    }
  }
}
