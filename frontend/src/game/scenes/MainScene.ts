import { BaseScene } from "./BaseScene";

export default class MainScene extends BaseScene {
  constructor() {
    super("MainScene");
  }

  create() {
    const { width } = this.scale;
    this.add.text(width / 2, 32, "Sit back and enjoy the last 3 years", {
      fontSize: "24px",
      color: "#ffffff",
      align: "center"
    }).setOrigin(0.5, 0);

    // Create player using the base class method
    this.playerFactory();
  }

  update() {
    this.updatePlayer();
  }
}