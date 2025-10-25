import { BusEvents, eventBus } from "../../utils/EventBus";
import type { MapSettings } from "./common/BaseScene";
import SceneWithInteractionModal from "./common/SceneWithInteractionModal";

const mapSize = { width: 1024, height: 1536 };

enum SceneObject {
  Star = "star",
  School = "backpack",
  Exam = "book",
  Movie = "movie",
  Jacket = "jacket",
  Door = "door",
}

export default class BrucoliScene extends SceneWithInteractionModal {
  private titleClosed = false;
  private objectToShow: SceneObject | undefined = SceneObject.Star; // By default we start from the STAR object

  constructor() {
    super("BrucoliScene");
  }

  private triggerTitle() {
    eventBus.emit(BusEvents.SHOW_TITLE, "Brucoli", "3 Settembre 2022");
    eventBus.on(BusEvents.TITLE_ANIMATION_END, () => (this.titleClosed = true));
  }


  private loadStarObject() {
    const { x, y } = this.getMapPosition(mapSize.width / 2 - 30, mapSize.height - 64);

    const onCollide = (
      obj: Phaser.Types.Physics.Arcade.ImageWithDynamicBody
    ) => {
      this.objectToShow = SceneObject.School;
      this.showModal(
        "Quindi devi mettere le stelline tra pochi giorni? \n Sei pronta al dolore?"
      );

      obj.destroy();
    };

    this.loadObject(x, y, SceneObject.Star, 0.2, onCollide);
  }

  private loadSchoolObject() {
    const { x, y } = this.getMapPosition(mapSize.width / 2 + 180, mapSize.height / 2 + 360);

    const onCollide = (
      obj: Phaser.Types.Physics.Arcade.ImageWithDynamicBody
    ) => {
      this.objectToShow = SceneObject.Jacket;
      this.showModal(
        "Allora inizierai in una scuola 'Paritaria' Bene! \n\n\n MA COSA DIAMINE È UNA SCUOLA PARITARIA"
      );

      obj.destroy();
    };

    this.loadObject(x, y, SceneObject.School, 0.05, onCollide);
  }

  private loadExamObject() {
    const { x, y } = this.getMapPosition(mapSize.width / 2 - 350, mapSize.height / 2);

    const onCollide = (
      obj: Phaser.Types.Physics.Arcade.ImageWithDynamicBody
    ) => {
      this.objectToShow = SceneObject.Movie;
      this.showModal(
        "Devo dare un esame si, Algebra Lineare \n Non so nulla lo boccio sicuro!"
      );

      obj.destroy();
    };

    this.loadObject(x, y, SceneObject.Exam, 0.1, onCollide);
  }

  private loadJacketObject() {
    const { x, y } = this.getMapPosition(mapSize.width / 2 + 84, mapSize.height / 2 - 64);

    const onCollide = (
      obj: Phaser.Types.Physics.Arcade.ImageWithDynamicBody
    ) => {
      this.objectToShow = SceneObject.Exam;
      this.showModal(
        "Ma perchè la giacca di jeans su un vestito così bello... \n Questa è proprio stupida..."
      );

      obj.destroy();
    };

    this.loadObject(x, y, SceneObject.Jacket, 0.1, onCollide);
  }

  private loadMovieObject() {
    const { x, y } = this.getMapPosition(mapSize.width / 2 - 10, 256);

    const onCollide = (
      obj: Phaser.Types.Physics.Arcade.ImageWithDynamicBody
    ) => {
      this.objectToShow = SceneObject.Door;
      this.showModal(
        "Sai esiste questa serie TV molto bella. Si chiama \n\nRiverdale"
      );

      obj.destroy();
    };

    this.loadObject(x, y, SceneObject.Movie, 0.13, onCollide);
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
        this.loadDoor("MedievalFestScene", width / 2 - 40, 56);
        break;
    }
  }

  create() {
    const { width, height } = this.scale;
    const mapSettings = this.cache.json.get("brucoliCollision") as MapSettings;
    const playerCoordinates = { x: width / 2 + 160, y: height };
    this.buildBackgroundWithColliders(mapSettings, playerCoordinates, false, 1);

    this.triggerTitle();
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
