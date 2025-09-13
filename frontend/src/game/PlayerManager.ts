import Phaser from "phaser";

export class PlayerManager {
  private player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private scene: Phaser.Scene;
  private speed: number;

  constructor(scene: Phaser.Scene, speed: number = 160) {
    this.scene = scene;
    this.speed = speed;
  }

  createPlayer(x: number, y: number): Phaser.Types.Physics.Arcade.SpriteWithDynamicBody {
    // Create player sprite
    this.player = this.scene.physics.add.sprite(x, y, "player");
    this.player.setOrigin(0.5, 0.5);
    this.player.setCollideWorldBounds(true);

    // Create player animations
    this.createPlayerAnimations();

    // Setup input
    this.cursors = this.scene.input.keyboard!.createCursorKeys();

    return this.player;
  }

  private createPlayerAnimations(): void {
    // Left animation
    this.scene.anims.create({
      key: "left",
      frames: this.scene.anims.generateFrameNumbers("player", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });

    // Turn/idle animation
    this.scene.anims.create({
      key: "turn",
      frames: [{ key: "player", frame: 4 }],
      frameRate: 20
    });

    // Right animation
    this.scene.anims.create({
      key: "right",
      frames: this.scene.anims.generateFrameNumbers("player", { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1
    });

    
  }

  updatePlayer(): void {
    if (!this.player || !this.cursors) return;

    // Handle horizontal movement
    if (this.cursors.left?.isDown) {
      this.player.setVelocityX(-this.speed);
      this.player.anims.play("left", true);
    } else if (this.cursors.right?.isDown) {
      this.player.setVelocityX(this.speed);
      this.player.anims.play("right", true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play("turn");
    }

    // Handle vertical movement
    if (this.cursors.up?.isDown) {
      this.player.setVelocityY(-this.speed);
    } else if (this.cursors.down?.isDown) {
      this.player.setVelocityY(this.speed);
    } else {
      this.player.setVelocityY(0);
    }
  }

  getPlayer(): Phaser.Types.Physics.Arcade.SpriteWithDynamicBody {
    return this.player;
  }

  setSpeed(speed: number): void {
    this.speed = speed;
  }

  destroy(): void {
    if (this.player) {
      this.player.destroy();
    }
  }
}