import Phaser from "phaser";
import { PlayerManager } from "../../PlayerManager";

interface ColliderRectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Collider {
  name: string;
  boxes: ColliderRectangle[];
}

export interface MapSettings {
  mapIdentifier: string;
  mapWidth: number;
  mapHeight: number;
  colliders: Collider[];
}

export abstract class BaseScene extends Phaser.Scene {
  protected playerManager!: PlayerManager;
  protected player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private collisionBodies!: Phaser.GameObjects.Rectangle[];

  private debugColliders(mapSettings: MapSettings) {
    const { width: screenWidth, height: screenHeight } = this.scale;

    const {
      height: displayHeight,
      width: displayWidth,
      scale,
    } = this.getScaledDisplaySize(mapSettings);

    let boxX = undefined;
    let boxY = undefined;
    for (const collider of mapSettings.colliders) {
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

  private setupColliders() {
    if (!this.collisionBodies?.length) return;
    for (const r of this.collisionBodies) {
      this.physics.add.collider(
        this.player,
        r as unknown as Phaser.GameObjects.GameObject
      );
    }
  }

  private getScaledDisplaySize(mapSettings: MapSettings): {
    width: number;
    height: number;
    scale: number;
  } {
    const { width, height } = this.scale;
    // Calculate scale to fit map to screen while maintaining aspect ratio
    const { mapWidth, mapHeight } = mapSettings;

    // Calculate how much we need to scale to fit the screen
    const screenScaleX = width / mapWidth;
    const screenScaleY = height / mapHeight;
    const scale = Math.min(screenScaleX, screenScaleY, 1); // Don't scale up beyond original size

    // Calculate actual display dimensions
    return { height: mapHeight * scale, width: mapWidth * scale, scale };
  }

  private buildMapColliders(mapSettings: MapSettings, debugMode = false) {
    const rects: Phaser.GameObjects.Rectangle[] = [];
    const { width: screenWidth, height: screenHeight } = this.scale;
    const {
      height: displayHeight,
      width: displayWidth,
      scale,
    } = this.getScaledDisplaySize(mapSettings);

    for (const collider of mapSettings.colliders) {
      for (const box of collider.boxes) {
        const scaledX = box.x * scale;
        const scaledY = box.y * scale;
        const scaledWidth = box.width * scale;
        const scaledHeight = box.height * scale;

        // Position relative to screen center and actual display dimensions
        const x = scaledX + screenWidth / 2 - displayWidth / 2;
        const y = scaledY + screenHeight / 2 - displayHeight / 2;
        const color = debugMode ? 0x00ff00 : 0x000000;
        const alpha = debugMode ? 0.5 : 0;

        const r = this.add.rectangle(
          x,
          y,
          scaledWidth,
          scaledHeight,
          color,
          alpha
        );
        this.physics.add.existing(r, true);
        rects.push(r);
      }
    }
    this.collisionBodies = rects;

    if (debugMode) {
      this.debugColliders(mapSettings);
    }

    if (this.player) {
      this.setupColliders();
    }
  }

  /**
   * Create the player with all the settings passed.
   *
   * @param y Start Y position of the player. Will fallback on the center of the screen
   * @param x Start X position of the player. Will fallback on the center of the screen
   * @param speed
   * @returns The created Player
   */
  protected playerFactory(
    x?: number,
    y?: number,
    speed?: number
  ): Phaser.Types.Physics.Arcade.SpriteWithDynamicBody {
    const { width, height } = this.scale;

    // Default to center of screen if no position provided
    const playerX = x ?? width / 2;
    const playerY = y ?? height / 2;

    // Create player manager with optional custom speed
    this.playerManager = new PlayerManager(this, speed);

    // Create and return the player
    this.player = this.playerManager.createPlayer(playerX, playerY);

    return this.player;
  }

  protected updatePlayer(): void {
    this.playerManager.updatePlayer();
  }

  protected getPlayer(): Phaser.Types.Physics.Arcade.SpriteWithDynamicBody {
    return this.player;
  }

  protected setPlayerSpeed(speed: number): void {
    this.playerManager.setSpeed(speed);
  }

  /**
   * Build the map with the background and the colliders already applied.
   * Needs to create the player to properly add the collision.
   *
   *
   * @param mapSettings Settings of the map
   * @param playerCoordinates Coordiantes where the player will be generated
   * @param debugMode If true the colliders will be highlithed
   *
   */
  protected buildBackgroundWithColliders(
    mapSettings: MapSettings,
    playerCoordinates: {x: number, y: number},
    debugMode = false
  ) {
    const { width, height } = this.scale;

    const x = width / 2;
    const y = height / 2;

    const {
      height: displayHeight,
      width: displayWidth,
      scale,
    } = this.getScaledDisplaySize(mapSettings);

    this.add.image(x, y, mapSettings.mapIdentifier).setScale(scale);

    // Use actual display dimensions for physics bounds
    const padding = 64;
    this.physics.world.setBounds(
      x - displayWidth / 2 + padding,
      y - displayHeight / 2 + padding,
      displayWidth - padding * 2,
      displayHeight - padding * 2
    );

    this.playerFactory(playerCoordinates.x, playerCoordinates.y);
    this.buildMapColliders(mapSettings, debugMode);
  }

  destroy(): void {
    if (this.playerManager) {
      this.playerManager.destroy();
    }
  }
}
