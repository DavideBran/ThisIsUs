import Phaser from "phaser";
import { PlayerManager } from "./PlayerManager";

export abstract class BaseScene extends Phaser.Scene {
  protected playerManager!: PlayerManager;
  protected player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

  constructor(key: string) {
    super(key);
  }

  protected createPlayer(x?: number, y?: number, speed?: number): Phaser.Types.Physics.Arcade.SpriteWithDynamicBody {
    const { width, height } = this.scale;
    
    // Default to center of screen if no position provided
    const playerX = x ?? width / 2;
    const playerY = y ?? height / 2;
    
    // Create player manager with optional custom speed
    this.playerManager = new PlayerManager(this, speed);
    
    // Create and return the player
    this.player = this.playerManager.createPlayer(playerX, playerY);
    
    return this.player;
  }

  protected updatePlayer(): void {
    this.playerManager.updatePlayer();
  }

  protected getPlayer(): Phaser.Types.Physics.Arcade.SpriteWithDynamicBody {
    return this.player;
  }

  protected setPlayerSpeed(speed: number): void {
    this.playerManager.setSpeed(speed);
  }

  destroy(): void {
    if (this.playerManager) {
      this.playerManager.destroy();
    }

  }
}