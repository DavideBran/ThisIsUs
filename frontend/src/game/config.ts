import Phaser from "phaser";
import BootScene from "./scenes/BootScene";
import BrucoliScene from "./scenes/BrucoliScene";

export const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: "game-container",
  width: window.innerWidth,
  height: window.innerHeight,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { x: 0, y: 0 },
    },
  },
  scene: [BootScene, BrucoliScene],
};
