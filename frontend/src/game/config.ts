import Phaser from "phaser";
import BootScene from "./scenes/BootScene";
import BrucoliScene from "./scenes/BrucoliScene";
import MedievalFestScene from "./scenes/MedievalFestScene";

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
  scale: {
    mode: Phaser.Scale.ScaleModes.FIT,
    autoCenter: Phaser.Scale.Center.CENTER_BOTH,
  },
  pixelArt: true,
  scene: [BootScene, BrucoliScene, MedievalFestScene],
};
