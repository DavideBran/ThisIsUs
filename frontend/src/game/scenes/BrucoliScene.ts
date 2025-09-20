import { DefaultAnimations, getFadeTween, getFloatingTween } from "../animations";
import SceneWithInteractionModal from "./SceneWithInteractionModal";

type TiledLike = {
  width: number;
  height: number;
  tilewidth: number;
  tileheight: number;
  layers: Array<{ name: string; data: number[] }>;
};

enum SceneObject {
  Star,
  School,
  Exam,
  Movie,
  Jacket,
}

export default class BrucoliScene extends SceneWithInteractionModal {
  private collisionBodies!: Phaser.GameObjects.Rectangle[];
  private titleClosed = false;

  private objectToShow: SceneObject | undefined = SceneObject.Star;

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

  private addSceneTitle() {
    const { width, height } = this.scale;

    const titleBox = this.add
      .rectangle(width / 2, height / 2 - 12, 500, 100, 0x2c3e50, 0.8)
      .setStrokeStyle(2, 0x3498db)
      .setAlpha(1);

    const titleText = this.add
      .text(width / 2, height / 2 - 10, "Brucoli 3 Settembre 2022", {
        fontSize: "28px",
        fontFamily: "Arial Black, sans-serif",
        color: "#ecf0f1",
        align: "center",
        stroke: "#2c3e50",
        strokeThickness: 2,
      })
      .setOrigin(0.5, 0.5)
      .setAlpha(1);

    getFadeTween(this.tweens, [titleBox, titleText]);

    this.time.delayedCall(1500, () => {
      this.tweens.add({
        targets: [titleBox, titleText],
        alpha: 0,
        duration: 1500,
        ease: "Power2.easeIn",
        onComplete: () => {
          titleBox.destroy();
          titleText.destroy();
          this.titleClosed = true;
        },
      });
    });
  }

  private loadDefaultObject(
    x: number,
    y: number,
    imageName: string,
    modalText: string,
    nextObject?: SceneObject,
    scale = 0.1
  ) {
    const object = this.physics.add.image(x, y, imageName).setScale(scale);

    object.setInteractive();

    object.body.immovable = true;

    const floatingTween = getFloatingTween(this.tweens, object);
    object.setData(DefaultAnimations.Floating, floatingTween);

    this.physics.add.overlap(this.player, object, () => {
      const floatingTween = object.getData(DefaultAnimations.Floating);
      if (floatingTween) {
        floatingTween.stop();
      }

      this.objectToShow = nextObject;
      this.showModal(modalText);

      object.destroy();
    });
  }

  private loadStarObject() {
    const { width, height } = this.scale;
    this.loadDefaultObject(
      width / 2 - 30,
      height - 50,
      "star",
      "Quindi devi mettere le stelline tra pochi giorni? \n Sei pronta al dolore?",
      SceneObject.School,
      0.2
    );
  }

  private loadSchoolObject() {
    const { width, height } = this.scale;
    this.loadDefaultObject(
      width / 2 + 128,
      height / 2 + 256,
      "backpack",
      "Allora inizierai in una scuola 'Paritaria' Bene! \n\n\n MA COSA DIAMINE È UNA SCUOLA PARITARIA",
      SceneObject.Jacket,
      0.05
    );
  }

  private loadExamObject() {
    const { width, height } = this.scale;
    this.loadDefaultObject(
      width / 2 - 230,
      height / 2,
      "book",
      "Devo dare un esame si, Algebra Lineare \n Non so nulla lo boccio sicuro!",
      SceneObject.Movie
    );
  }

  private loadJacketObject() {
    const { width, height } = this.scale;
    this.loadDefaultObject(
      width / 2 + 50,
      height / 2 - 64,
      "jacket",
      "Ma perchè la giacca di jeans su un vestito così bello... \n Questa è proprio stupida...",
      SceneObject.Exam
    );
  }

  private loadMovieObject() {
    const { width } = this.scale;
    this.loadDefaultObject(
      width / 2 - 40,
      32,
      "movie",
      "Sai esiste questa serie TV molto bella. Si chiama \n\nRiverdale",
      undefined,
      0.13
    );
  }

  private loadNextObject() {
    switch (this.objectToShow) {
      case SceneObject.Star:
        this.loadStarObject();
        break;
      case SceneObject.Exam:
        this.loadExamObject();
        break;
      case SceneObject.School:
        this.loadSchoolObject();
        break;
      case SceneObject.Movie:
        this.loadMovieObject();
        break;
      case SceneObject.Jacket:
        this.loadJacketObject();
        break;
    }

    //this.loadStarObject();
    //this.loadExamObject();
    //this.loadSchoolObject();
    //this.loadMovieObject();
    //this.loadJacketObject();
  }

  create() {
    this.buildBackground();
    this.addSceneTitle();

    const { width, height } = this.scale;
    this.playerFactory(width / 2 + 192, height + 32);
    this.setupColliders();
    this.loadNextObject();

    this.enterKey = this.input.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.ENTER
    );
  }

  update() {
    if(!this.titleClosed) return;

    if (!this.isModalOpen) {
      this.updatePlayer();
    } else if (Phaser.Input.Keyboard.JustDown(this.enterKey)) {
      this.hideModal();
      this.loadNextObject();
    }
  }
}
