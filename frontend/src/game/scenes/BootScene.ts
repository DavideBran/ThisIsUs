import Phaser from "phaser";
import { MAP_PATH, PLAYER_PATH, TILESET_PATH } from "../../Paths";

export default class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  private loadPlayerSprite() {
    // Idle
    this.load.spritesheet("player_idle", `${PLAYER_PATH}/idle.png`, {
      frameWidth: 36,
      frameHeight: 44,
    });

    // Left walk
    this.load.spritesheet("player_walk_left", `${PLAYER_PATH}/left.png`, {
      frameWidth: 38,
      frameHeight: 44,
    });

    // Right walk
    this.load.spritesheet("player_walk_right", `${PLAYER_PATH}/right.png`, {
      frameWidth: 29,
      frameHeight: 44,
    });

    // Down walk
    this.load.spritesheet("player_walk_down", `${PLAYER_PATH}/down.png`, {
      frameWidth: 24,
      frameHeight: 44,
    });

    // Up walk
    this.load.spritesheet("player_walk_up", `${PLAYER_PATH}/up.png`, {
      frameWidth: 25,
      frameHeight: 43,
    });
  }

  private loadContents() {
    this.load.image("brucoliMap", `${MAP_PATH}/brucoli.png`);
    this.load.json("brucoliCollision", `${TILESET_PATH}/brucoli.json`);
  }

  preload() {
    this.loadPlayerSprite();
    this.loadContents();
  }

  create() {
    this.scene.start("BrucoliScene");
  }
}
