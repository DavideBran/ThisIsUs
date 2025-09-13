import Phaser from "phaser";

export default class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene");
  }

  preload() {
    // Idle
    this.load.spritesheet(
      "player_idle",
      "./src/assets/player/player_idle_animation.png",
      {
        frameWidth: 36,
        frameHeight: 44,
      }
    );

    // Left walk
    this.load.spritesheet(
      "player_walk_left",
      "./src/assets/player/player_walk_left_animation.png",
      {
        frameWidth: 38,
        frameHeight: 44,
      }
    );

    // Right walk
    this.load.spritesheet(
      "player_walk_right",
      "./src/assets/player/player_walk_right_animation.png",
      {
        frameWidth: 29,
        frameHeight: 44,
      }
    );

    // Down walk
    this.load.spritesheet(
      "player_walk_down",
      "./src/assets/player/player_walk_down_animation.png",
      {
        frameWidth: 24,
        frameHeight: 44,
      }
    );
    
    // Up walk
    this.load.spritesheet(
      "player_walk_up",
      "./src/assets/player/player_walk_up_animation.png",
      {
        frameWidth: 25,
        frameHeight: 43,
      }
    );
  }

  create() {
    this.scene.start("MainScene");
  }
}
