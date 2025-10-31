import Phaser from "phaser";
import {
  MAP_PATH,
  NPC_PATH,
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
    this.load.image("streetFoodMap", `${MAP_PATH}/street-food.png`);
    this.load.image("bedroomMap", `${MAP_PATH}/bedroom.png`);

    // Maps Collision
    this.load.json("brucoliCollision", `${TILESET_PATH}/brucoli.json`);
    this.load.json("bedroomCollision", `${TILESET_PATH}/bedroom.json`);
    this.load.json(
      "medievalFestCollision",
      `${TILESET_PATH}/medieval-fest.json`
    );
    this.load.json(
      "streetFoodCollision",
      `${TILESET_PATH}/street-food.json`
    );

    // Game Objects
    this.load.image("star", `${OBJECT_PATH}/star.png`);
    this.load.image("suppli", `${OBJECT_PATH}/suppli.png`);
    this.load.image("book", `${OBJECT_PATH}/book.png`);
    this.load.image("backpack", `${OBJECT_PATH}/backpack.png`);
    this.load.image("jacket", `${OBJECT_PATH}/jacket.png`);
    this.load.image("movie", `${OBJECT_PATH}/movie.png`);
    this.load.image("grate", `${OBJECT_PATH}/grate.png`);
    this.load.image("pizza", `${OBJECT_PATH}/pizza.png`);
    this.load.image("phone", `${OBJECT_PATH}/iphone.png`);
    this.load.image("laptop", `${OBJECT_PATH}/laptop.png`);


    this.load.spritesheet("portal", `${OBJECT_PATH}/portal.png`, {
      frameWidth: 32,
      frameHeight: 32,
    });

    // NPCs
    const fireBreatherSprites = 4;
    const fireBreatherSpritesRows = 2;
    const fireBreatherSpriteSheetSize = 500;
    this.load.spritesheet("fireBreather", `${NPC_PATH}/fire-breather.png`, {
      frameWidth: fireBreatherSpriteSheetSize / fireBreatherSprites,
      frameHeight: fireBreatherSpriteSheetSize / fireBreatherSpritesRows,
    });

    const knightSprites = 3;
    const knightSpritesRows = 3;
    const knightSpriteSheetSize = 384;
    this.load.spritesheet("knight", `${NPC_PATH}/knight.png`, {
      frameWidth: knightSpriteSheetSize / knightSprites,
      frameHeight: knightSpriteSheetSize / knightSpritesRows,
    });
  }

  preload() {
    this.loadPlayerSprite();
    this.loadContents();
  }

  create() {
    this.scene.start("BrucoliScene");
  }
}
