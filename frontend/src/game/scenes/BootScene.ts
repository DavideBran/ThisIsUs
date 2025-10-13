import Phaser from "phaser";
import {
  MAP_PATH,
  OBJECT_PATH,
  PLAYER_PATH,
  TILESET_PATH,
} from "../../utils/Paths";

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
    // Maps
    this.load.image("brucoliMap", `${MAP_PATH}/brucoli.png`);
    this.load.image("medievalFestMap", `${MAP_PATH}/medieval-fest.png`);
    this.load.json("brucoliCollision", `${TILESET_PATH}/brucoli.json`);
    this.load.json("medievalFestCollision", `${TILESET_PATH}/medieval-fest.json`);

    // Game Objects
    this.load.image("star", `${OBJECT_PATH}/star.png`);
    this.load.image("book", `${OBJECT_PATH}/book.png`);
    this.load.image("backpack", `${OBJECT_PATH}/backpack.png`);
    this.load.image("jacket", `${OBJECT_PATH}/jacket.png`);
    this.load.image("movie", `${OBJECT_PATH}/movie.png`);
    this.load.spritesheet("portal", `${OBJECT_PATH}/portal.png`, {
      frameWidth: 32,
      frameHeight: 32,
    });
  }

  preload() {
    this.loadPlayerSprite();
    this.loadContents();
  }

  create() {
    this.scene.start("MedievalFestScene");
  }
}
