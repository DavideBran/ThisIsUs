import { BaseScene } from "./BaseScene";

export default class SceneWithInteractionModal extends BaseScene {
  // Object intercation modal settings
  private modalBackground!: Phaser.GameObjects.Rectangle;
  private modalText!: Phaser.GameObjects.Text;
  protected isModalOpen: boolean = false;
  protected enterKey!: Phaser.Input.Keyboard.Key;

  private isCreated: boolean = false;

  private createModal() {
    this.isCreated = true;
    const { width, height } = this.scale;

    // Create semi-transparent background
    this.modalBackground = this.add
      .rectangle(width / 2, height / 2, width, height, 0x000000, 0.7)
      .setDepth(1000)
      .setVisible(false);

    // Create modal container
    const modalContainer = this.add
      .container(width / 2, height / 2)
      .setDepth(1001);

    // Modal background
    const modalBg = this.add
      .rectangle(0, 0, 600, 300, 0x2c3e50, 0.95)
      .setStrokeStyle(3, 0x34495e);
    modalContainer.add(modalBg);

    // Modal text
    this.modalText = this.add
      .text(0, 0, "", {
        fontSize: "20px",
        color: "#ffffff",
        align: "center",
        wordWrap: { width: 550 },
      })
      .setOrigin(0.5, 0.5);

    modalContainer.add(this.modalText);

    // Instructions text
    const instructions = this.add
      .text(0, 120, "Press ENTER to continue", {
        fontSize: "16px",
        color: "#bdc3c7",
        align: "center",
      })
      .setOrigin(0.5, 0.5);
    modalContainer.add(instructions);

    modalContainer.setVisible(false);

    // Store references
    this.modalBackground.setData("container", modalContainer);
  }

  protected showModal(text: string) {
    if(!this.isCreated) this.createModal();

    this.isModalOpen = true;
    this.modalText.setText(text);

    this.modalBackground.setVisible(true);
    const container = this.modalBackground.getData("container");
    container.setVisible(true);

    // Pause player movement
    this.player.setVelocity(0, 0);
  }

  protected hideModal() {
    this.isModalOpen = false;

    this.modalBackground.setVisible(false);
    const container = this.modalBackground.getData("container");
    container.setVisible(false);
  }

}
