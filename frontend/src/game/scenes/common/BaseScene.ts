import Phaser from "phaser";
import { PlayerManager } from "../../PlayerManager";
import { DefaultAnimations, getFloatingTween } from "../../animations";

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
  protected fadingOut = false;
  private collisionBodies!: Phaser.GameObjects.Rectangle[];
  private mapSettings!: MapSettings;

  private debugColliders() {
    const { width: screenWidth, height: screenHeight } = this.scale;
    const mapSettings = this.mapSettings;

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

  private buildMapColliders(debugMode = false) {
    const mapSettings = this.mapSettings;
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
      this.debugColliders();
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
   * Load the door object to swithc to the next scenario.
   *
   * @param scenarioId Identifier of the next scenario
   */
  protected loadDoor(scenarioId: string, x: number, y: number) {
    if (!this.player) return;

    const { width } = this.scale;
    const portal = this.physics.add.sprite(x, y, "portal");
    portal.setInteractive();

    this.anims.create({
      key: "portal-idle",
      frames: this.anims.generateFrameNumbers("portal", { start: 0, end: -1 }),
      frameRate: 10,
      repeat: -1,
    });

    portal.play("portal-idle");
    this.physics.add.overlap(this.player, portal, () => {
      const floatingTween = portal.getData(DefaultAnimations.Floating);
      if (floatingTween) {
        floatingTween.stop();
      }

      this.fadingOut = true;
      // Moving the player away to avoid recalling this function
      this.player.setVisible(false);
      this.tweens.add({
        targets: this.player,
        x: width,
        y: portal.y,
        scaleX: 0.1,
        scaleY: 0.1,
        alpha: 0,
        duration: 1000,
        ease: "Power2",
      });

      this.cameras.main.fadeOut(1000, 0, 0, 0);
      this.cameras.main.once("camerafadeoutcomplete", () => {
        this.scene.start(scenarioId);
      });
    });
  }

  /**
   * Calculates the scaled display dimensions for a map to fit properly on the screen.
   * Maintains aspect ratio and ensures the map doesn't scale beyond its original size.
   *
   * @param mapSettings The map configuration containing width and height
   * @returns Object containing scaled width, height, and scale factor
   */
  protected getScaledDisplaySize(mapSettings: MapSettings): {
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

  /**
   * 
   * @param mapX Coordinate x
   * @param mapY Coordinate y
   * @returns The coordinate x and y scaled on the map
   */
  protected getMapPosition(
    mapX: number,
    mapY: number
  ): { x: number; y: number } {
    const { width, height } = this.scale;
    const mapSettings = this.mapSettings;
    const { scale } = this.getScaledDisplaySize(mapSettings);

    const scaledX = mapX * scale;
    const scaledY = mapY * scale;
    const x = scaledX + width / 2 - (mapSettings.mapWidth * scale) / 2;
    const y = scaledY + height / 2 - (mapSettings.mapHeight * scale) / 2;

    return { x, y };
  }

  /**
   * Build the map with the background and the colliders already applied.
   * Needs to create the player to properly add the collision.
   *
   *
   * @param mapSettings Settings of the map. Will be stored
   * @param playerCoordinates Coordiantes where the player will be generated
   * @param debugMode If true the colliders will be highlithed
   * @param customScale
   *
   */
  protected buildBackgroundWithColliders(
    mapSettings: MapSettings,
    playerCoordinates: { x: number; y: number },
    debugMode = false,
    customScale?: number
  ) {
    this.mapSettings = mapSettings;
    const { width, height } = this.scale;

    const x = width / 2;
    const y = height / 2;

    const {
      height: displayHeight,
      width: displayWidth,
      scale,
    } = this.getScaledDisplaySize(mapSettings);

    this.add
      .image(x, y, mapSettings.mapIdentifier)
      .setScale(customScale ?? scale);

    // Use actual display dimensions for physics bounds
    const padding = 64;
    this.physics.world.setBounds(
      x - displayWidth / 2 + padding,
      y - displayHeight / 2 + padding,
      displayWidth - padding * 2,
      displayHeight - padding * 2
    );

    this.playerFactory(playerCoordinates.x, playerCoordinates.y);
    this.buildMapColliders(debugMode);
  }

  /**
   * Load an object on the map
   *
   * @param x
   * @param y
   * @param objectId Object id to load the correct image
   * @param scale Scale factor of the object (by default = 0.5)
   * @param collisionCallback Function colled on collision with the object
   * @param loadFloatingTween If true the object will load a floating animation (true by default)
   */
  protected loadObject(
    x: number,
    y: number,
    objectId: string,
    scale = 0.5,
    collisionCallback?: (
      obj: Phaser.Types.Physics.Arcade.ImageWithDynamicBody
    ) => void,
    loadFloatingTween = true
  ) {
    const obj = this.physics.add.image(x, y, objectId).setScale(scale);
    obj.setInteractive();
    obj.body.immovable = true;

    if (loadFloatingTween) {
      const floatingTween = getFloatingTween(this.tweens, obj);
      obj.setData(DefaultAnimations.Floating, floatingTween);
    }

    this.physics.add.overlap(this.player, obj, () => {
      this.player.anims.stop();

      if (loadFloatingTween) {
        const floatingTween = obj.getData(DefaultAnimations.Floating);
        if (floatingTween) {
          floatingTween.stop();
        }
      }

      collisionCallback?.(obj);
    });
  }

  destroy(): void {
    if (this.playerManager) {
      this.playerManager.destroy();
    }
  }
}
