import Phaser from "phaser";

export default class MainScene extends Phaser.Scene {
  private player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super("MainScene");
  }


  create() {
    const { width, height } = this.scale;
    this.add.text(width / 2, 32, "Sit back and enjoy the last 3 years", {
      fontSize: "24px",
      color: "#ffffff",
      align: "center"
    }).setOrigin(0.5, 0);

    // Player
    this.player = this.physics.add.sprite(width / 2, height / 2, "player");
    this.player.setOrigin(0.5, 0.5);
    this.player.setCollideWorldBounds(true);

    // Player animations
    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("player", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: "turn",
      frames: [{ key: "player", frame: 4 }],
      frameRate: 20
    });

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("player", { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1
    });

    this.cursors = this.input.keyboard!.createCursorKeys();
  }

  update() {
    this._movePlayer();
  }

  private _movePlayer(){
    if (this.cursors.left?.isDown) {
      this.player.setVelocityX(-160);
      this.player.anims.play("left", true);
    } else if (this.cursors.right?.isDown) {
      this.player.setVelocityX(160);
      this.player.anims.play("right", true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play("turn");
    }

    if (this.cursors.up?.isDown) {
      this.player.setVelocityY(-160);
    } else if (this.cursors.down?.isDown) {
      this.player.setVelocityY(160);
    } else {
      this.player.setVelocityY(0);
    }
  }
}
