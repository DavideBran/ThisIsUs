import Phaser from "phaser";

export class PlayerManager {
  private player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private readonly scene: Phaser.Scene;
  private speed: number;

  constructor(scene: Phaser.Scene, speed: number = 160) {
    this.scene = scene;
    this.speed = speed;
  }

  createPlayer(
    x: number,
    y: number
  ): Phaser.Types.Physics.Arcade.SpriteWithDynamicBody {
    // Create player sprite
    this.player = this.scene.physics.add.sprite(x, y, "player_idle");
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
      frames: this.scene.anims.generateFrameNumbers("player_walk_left", {
        start: 0,
        end: -1,
      }),
      frameRate: 10,
      repeat: -1,
    });

    // Turn/idle animation
    this.scene.anims.create({
      key: "turn",
      frames: this.scene.anims.generateFrameNumbers("player_idle", {
        start: 0,
        end: -1,
      }),
      frameRate: 10,
      repeat: -1,
    });

    // Right animation
    this.scene.anims.create({
      key: "right",
      frames: this.scene.anims.generateFrameNumbers("player_walk_right", {
        start: 0,
        end: -1,
      }),
      frameRate: 10,
      repeat: -1,
    });

    // Up animation
    this.scene.anims.create({
      key: "up",
      frames: this.scene.anims.generateFrameNumbers("player_walk_up", {
        start: 0,
        end: -1,
      }),
      frameRate: 10,
      repeat: -1,
    });

    // Down animation
    this.scene.anims.create({
      key: "down",
      frames: this.scene.anims.generateFrameNumbers("player_walk_down", {
        start: 0,
        end: -1,
      }),
      frameRate: 10,
      repeat: -1,
    });
  }

  private isHorizontalMovement() {
    return this.cursors.left?.isDown || this.cursors.right?.isDown;
  }

  private isVerticalMovement() {
    return this.cursors.down.isDown || this.cursors.up.isDown;
  }

  private handleVerticalMovement() {
    if (!this.isVerticalMovement()) return;

    if (this.cursors.up?.isDown) {
      this.player.setVelocityY(-this.speed);
      this.player.anims.play("up", true);
    } else {
      this.player.setVelocityY(this.speed);
      this.player.anims.play("down", true);
    }
  }

  private handleHorizontalMovement() {
    if (!this.isHorizontalMovement()) return;

    if (this.cursors.left?.isDown) {
      this.player.setVelocityX(-this.speed);
      this.player.anims.play("left", true);
    } else {
      this.player.setVelocityX(this.speed);
      this.player.anims.play("right", true);
    }
  }

  updatePlayer(): void {
    if (!this.player || !this.cursors) return;

    this.player.setVelocityX(0);
    this.player.setVelocityY(0);

    if (this.isHorizontalMovement()) {
      this.handleHorizontalMovement();
    } else if (this.isVerticalMovement()) {
      this.handleVerticalMovement();
    } else {
      this.player.anims.play("turn");
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
