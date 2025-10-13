import Phaser from "phaser";
import SceneWithInteractionModal from "./common/SceneWithInteractionModal";
import { eventBus, BusEvents } from "../../utils/EventBus";

type Boxes = {
  x: number;
  y: number;
  width: number;
  height: number;
};
type ColliderData = {
  name: string;
  boxes: Boxes[];
};

type MedievalFestCollisionData = {
  mapWidth: number;
  mapHeight: number;
  tilewidth: number;
  tileheight: number;
  colliders: ColliderData[];
  layers: unknown[];
};

export default class MedievalFestScene extends SceneWithInteractionModal {
  private titleClosed = false;
  private collisionBodies!: Phaser.GameObjects.Rectangle[];
  private mapInfo: MedievalFestCollisionData | undefined;

  constructor() {
    super("MedievalFestScene");
  }

  private triggerTitle() {
    eventBus.emit(BusEvents.SHOW_TITLE, "Medieval Fest");
    eventBus.on(BusEvents.TITLE_ANIMATION_END, () => (this.titleClosed = true));
  }

  private buildBackground() {
    if (!this.mapInfo) return;
    const { width, height } = this.scale;

    const x = width / 2;
    const y = height / 2;

    // Calculate scale to fit map to screen while maintaining aspect ratio
    const { mapWidth, mapHeight } = this.mapInfo;

    // Calculate how much we need to scale to fit the screen
    const screenScaleX = width / mapWidth;
    const screenScaleY = height / mapHeight;
    const scale = Math.min(screenScaleX, screenScaleY, 1); // Don't scale up beyond original size

    // Calculate actual display dimensions
    const displayWidth = mapWidth * scale;
    const displayHeight = mapHeight * scale;

    this.add.image(x, y, "medievalFestMap").setScale(scale);

    // Use actual display dimensions for physics bounds
    const padding = 64;
    this.physics.world.setBounds(
      x - displayWidth / 2 + padding,
      y - displayHeight / 2 + padding,
      displayWidth - padding * 2,
      displayHeight - padding * 2
    );

    this.buildCollisionFromJson(scale, displayWidth, displayHeight);
  }

  // #TODO we can move this on a common place
  private buildCollisionFromJson(
    scale: number,
    displayWidth: number,
    displayHeight: number
  ) {
    const raw = this.cache.json.get(
      "medievalFestCollision"
    ) as MedievalFestCollisionData;
    if (!raw?.colliders || !this.mapInfo) return;

    const rects: Phaser.GameObjects.Rectangle[] = [];
    const { width: screenWidth, height: screenHeight } = this.scale;

    for (const collider of raw.colliders) {
      for (const box of collider.boxes) {
        const scaledX = box.x * scale;
        const scaledY = box.y * scale;
        const scaledWidth = box.width * scale;
        const scaledHeight = box.height * scale;

        // Position relative to screen center and actual display dimensions
        const x = scaledX + screenWidth / 2 - displayWidth / 2;
        const y = scaledY + screenHeight / 2 - displayHeight / 2;

        const r = this.add.rectangle(
          x,
          y,
          scaledWidth,
          scaledHeight,
          0x00ff00,
          0.5
        );
        this.physics.add.existing(r, true); // static body
        rects.push(r);
      }
    }
    this.collisionBodies = rects;
  }

  // #TODO we can move this on a common place
  private setupColliders() {
    if (!this.collisionBodies?.length) return;
    for (const r of this.collisionBodies) {
      this.physics.add.collider(
        this.player,
        r as unknown as Phaser.GameObjects.GameObject
      );
    }
  }

  // #TODO we can move this on a common place
  private debugColliders() {
    const raw = this.mapInfo;
    if (!raw?.colliders || !this.mapInfo) return;

    const { width: screenWidth, height: screenHeight } = this.scale;
    const { mapWidth, mapHeight } = this.mapInfo;

    // Calculate the same scale as in buildBackground
    const screenScaleX = screenWidth / mapWidth;
    const screenScaleY = screenHeight / mapHeight;
    const scale = Math.min(screenScaleX, screenScaleY, 1);

    const displayWidth = mapWidth * scale;
    const displayHeight = mapHeight * scale;

    let boxX = undefined;
    let boxY = undefined;
    for (const collider of raw.colliders) {
      // Use the same scaling and positioning as buildCollisionFromJson
      for (const box of collider.boxes) {
        const scaledX = box.x * scale;
        const scaledY = box.y * scale;

        const x = scaledX + screenWidth / 2 - displayWidth / 2;
        const y = scaledY + screenHeight / 2 - displayHeight / 2;

        if (boxX === undefined && boxY === undefined) {
          boxX = x;
          boxY = y;
        }

        // Add coordinate text
        this.add
          .text(x, y + 15, `(${box.x}, ${box.y})`, {
            fontSize: "12px",
            color: "#ff0000",
            backgroundColor: "#ffffff",
          })
          .setOrigin(0.5, 0.5);
      }
      // Add box name
      if (boxX !== undefined && boxY !== undefined) {
        this.add
          .text(boxX, boxY - 50, collider.name, {
            fontSize: "10px",
            color: "#ff0000",
            backgroundColor: "#ffffff",
          })
          .setOrigin(0.5, 0.5);
      }

      boxX = undefined;
      boxY = undefined;
    }
  }

  create() {
    const { width, height } = this.scale;

    this.mapInfo = this.cache.json.get(
      "medievalFestCollision"
    ) as MedievalFestCollisionData;
    this.buildBackground();
    this.triggerTitle();

    this.playerFactory(width / 2, height / 2 + 124);
    this.setupColliders();
    this.debugColliders(); // Enable this to see coordinates
  }

  update() {
    if (!this.titleClosed) return;
    this.updatePlayer();
  }
}
