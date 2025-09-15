import { BaseScene } from "./BaseScene";

type TiledLike = {
  width: number;
  height: number;
  tilewidth: number;
  tileheight: number;
  layers: Array<{ name: string; data: number[] }>;
};

export default class BrucoliScene extends BaseScene {
  private collisionBodies!: Phaser.GameObjects.Rectangle[];

  constructor() {
    super("BrucoliScene");
  }

  private buildBackground() {
    const { width, height } = this.scale;
    const bg = this.add.image(width / 2, height / 2, "brucoliMap");
    const w = bg.displayWidth;
    const padding = 64;
    this.physics.world.setBounds(w / 2 - padding, 0, w, height);
    this.buildCollisionFromJson(w);
  }

  private buildCollisionFromJson(mapWidth: number) {
    const raw = this.cache.json.get("brucoliCollision") as TiledLike;
    if (!raw) return;

    const layer = raw.layers.find((l) => l.name === "Collision");
    if (!layer) return;

    const { width, height, tilewidth, tileheight } = raw;
    const data = layer.data; // 1D array length = width * height

    const rects: Phaser.GameObjects.Rectangle[] = [];
    const screenWidth = this.scale.width;
    for (let ty = 0; ty < height; ty++) {
      for (let tx = 0; tx < width; tx++) {
        const idx = ty * width + tx;
        const v = data[idx];
        if (v === 1) {
          const x = tx * tilewidth + tilewidth / 2;
          const y = ty * tileheight + tileheight / 2;

          const r = this.add.rectangle(
            x + screenWidth / 2 - mapWidth / 2,
            y,
            tilewidth,
            tileheight,
            0x000000,
            0
          );
          this.physics.add.existing(r, true); // static body
          rects.push(r);
        }
      }
    }
    this.collisionBodies = rects;
  }

  private setupColliders() {
    if (!this.collisionBodies?.length) return;
    for (const r of this.collisionBodies) {
      this.physics.add.collider(
        this.player,
        r as unknown as Phaser.GameObjects.GameObject
      );
    }
  }

  // #TODO add fade effect to the title with a proper style on top
  private addSceneTitle() {
    const { width } = this.scale;
    this.add
      .text(width / 2, 32, "Sit back and enjoy the last 3 years", {
        fontSize: "24px",
        color: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5, 0);
  }

  create() {
    this.buildBackground();
    this.addSceneTitle();

    const { width, height } = this.scale;
    this.playerFactory(width / 2 + 192, height + 32);
    this.setupColliders();
  }

  update() {
    this.updatePlayer();
  }
}
