import { BusEvents, eventBus } from "../../utils/EventBus";
import type { MapSettings } from "./common/BaseScene";
import SceneWithInteractionModal from "./common/SceneWithInteractionModal";

export default class MedievalFestScene extends SceneWithInteractionModal {
  private titleClosed = false;

  constructor() {
    super("MedievalFestScene");
  }

  private triggerTitle() {
    eventBus.emit(BusEvents.SHOW_TITLE, "Medieval Fest");
    eventBus.on(BusEvents.TITLE_ANIMATION_END, () => (this.titleClosed = true));
  }

  create() {
    const { width, height } = this.scale;
    const mapSettings = this.cache.json.get(
      "medievalFestCollision"
    ) as MapSettings;
    const playerCoordinates = { x: width / 2, y: height / 2 + 124 };
    this.buildBackgroundWithColliders(mapSettings, playerCoordinates);
    this.triggerTitle();
  }

  update() {
    if (!this.titleClosed) return;
    this.updatePlayer();
  }
}
