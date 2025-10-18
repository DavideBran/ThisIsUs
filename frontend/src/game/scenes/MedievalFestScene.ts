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

  private getNpcAnimation(key: string, animName: string, framRate = 3) {
    return {
      key: key,
      frames: this.anims.generateFrameNumbers(animName, {
        start: 0,
        end: -1,
      }),
      frameRate: framRate,
      repeat: -1,
    };
  }

  private getMapPosition(mapX: number, mapY: number): { x: number; y: number } {
    const { width, height } = this.scale;
    const mapSettings = this.cache.json.get(
      "medievalFestCollision"
    ) as MapSettings;
    const { scale } = this.getScaledDisplaySize(mapSettings);

    const scaledX = mapX * scale;
    const scaledY = mapY * scale;
    const x = scaledX + width / 2 - (mapSettings.mapWidth * scale) / 2;
    const y = scaledY + height / 2 - (mapSettings.mapHeight * scale) / 2;

    return { x, y };
  }

  private loadNpcs() {
    // Define NPC positions in map coordinates
    const fireBreatherPos = this.getMapPosition(670, 128);
    const knightPos = this.getMapPosition(1016, 256);

    const fireBreather = this.physics.add
      .sprite(fireBreatherPos.x, fireBreatherPos.y, "fireBreather")
      .setScale(0.25);
    fireBreather.setInteractive();

    const knight = this.physics.add
      .sprite(knightPos.x, knightPos.y, "knight")
      .setScale(0.6);
    knight.setInteractive();

    const knightAnimKey = "knight-idle";
    const fireBreatherAnimKey = "fire-breather";

    const knightAnim = this.getNpcAnimation(knightAnimKey, "knight", 6);
    const fireBreatherAnim = this.getNpcAnimation(
      fireBreatherAnimKey,
      "fireBreather"
    );

    this.anims.create(knightAnim);
    this.anims.create(fireBreatherAnim);

    fireBreather.play(fireBreatherAnimKey);
    knight.play(knightAnimKey);
  }

  create() {
    const { width, height } = this.scale;
    const mapSettings = this.cache.json.get(
      "medievalFestCollision"
    ) as MapSettings;
    const playerCoordinates = { x: width / 2, y: height / 2 + 124 };
    this.buildBackgroundWithColliders(mapSettings, playerCoordinates);
    this.loadNpcs();
    this.triggerTitle();
  }

  update() {
    if (!this.titleClosed) return;
    this.updatePlayer();
  }
}
