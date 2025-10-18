import { BusEvents, eventBus } from "../../utils/EventBus";
import { DefaultAnimations, getFloatingTween } from "../animations";
import SceneWithInteractionModal from "./common/SceneWithInteractionModal";

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
  Door,
}

// #TODO Make sure the colliders and the map respect thec reen size
// #TODO Properly implement the colliders with the baseScene class.
// Using the function buildMapColliders
export default class BrucoliScene extends SceneWithInteractionModal {
  private customCollisionBodies!: Phaser.GameObjects.Rectangle[];
  private titleClosed = false;
  private objectToShow: SceneObject | undefined = SceneObject.Star; // By default we start from the STAR object

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
    this.customCollisionBodies = rects;
  }

  private customSetupColliders() {
    if (!this.customCollisionBodies?.length) return;
    for (const r of this.customCollisionBodies) {
      this.physics.add.collider(
        this.player,
        r as unknown as Phaser.GameObjects.GameObject
      );
    }
  }

  private triggerTitle() {
    eventBus.emit(BusEvents.SHOW_TITLE, "Brucoli", "3 Settembre 2022");
    eventBus.on(BusEvents.TITLE_ANIMATION_END, () => (this.titleClosed = true));
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
      this.player.anims.stop();

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
      width / 2 - 10,
      160,
      "movie",
      "Sai esiste questa serie TV molto bella. Si chiama \n\nRiverdale",
      SceneObject.Door,
      0.13
    );
  }

  private loadNextObject() {
    const { width } = this.scale;

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
      case SceneObject.Door:
        this.loadDoor("MedievalFestScene", width / 2 - 40, 24);
        break;
    }
  }

  create() {
    this.buildBackground();
    this.triggerTitle();

    const { width, height } = this.scale;
    this.playerFactory(width / 2 + 192, height + 32);
    this.customSetupColliders();
    this.loadNextObject();

    this.enterKey = this.input.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.ENTER
    );
  }

  update() {
    if (!this.titleClosed || this.fadingOut) return;

    if (!this.isModalOpen) {
      this.updatePlayer();
    } else if (Phaser.Input.Keyboard.JustDown(this.enterKey)) {
      this.hideModal();
      this.loadNextObject();
    }
  }
}
