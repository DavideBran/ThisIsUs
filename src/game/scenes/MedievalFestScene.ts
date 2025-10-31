import { BusEvents, eventBus } from "../../utils/EventBus";
import type { MapSettings } from "./common/BaseScene";
import SceneWithInteractionModal from "./common/SceneWithInteractionModal";

const CLEAR_TIMEOUT = 1000 * 10;
export default class MedievalFestScene extends SceneWithInteractionModal {
  private titleClosed = false;
  private readonly hasInteracted = new Set();
  private interactionCount = 0;

  constructor() {
    super("MedievalFestScene");
  }

  private shouldShowDoor() {
    if (this.interactionCount >= 3) {
      const { x, y } = this.getMapPosition(530, 420);
      this.loadDoor("StreetFoodScene", x, y);
    }
  }

  private removeInteraction(key: string) {
    this.shouldShowDoor();
    setTimeout(() => {
      if (this.hasInteracted.has(key)) {
        this.hasInteracted.delete(key);
      }
    }, CLEAR_TIMEOUT);
  }

  private triggerTitle() {
    eventBus.emit(BusEvents.SHOW_TITLE, "Medieval Fest");
    eventBus.on(BusEvents.TITLE_ANIMATION_END, () => (this.titleClosed = true));
  }

  private getNpcAnimation(key: string, animName: string, framRate = 3) {
    return {
      key: key,
      frames: this.anims.generateFrameNumbers(animName, {
        start: 0,
        end: -1,
      }),
      frameRate: framRate,
      repeat: -1,
    };
  }

  private loadNpcs() {
    // Define NPC positions in map coordinates
    const fireBreatherPos = this.getMapPosition(670, 128);
    const knightPos = this.getMapPosition(1016, 256);

    const fireBreather = this.physics.add
      .sprite(fireBreatherPos.x, fireBreatherPos.y, "fireBreather")
      .setScale(0.25);
    fireBreather.setInteractive();

    const knight = this.physics.add
      .sprite(knightPos.x, knightPos.y, "knight")
      .setScale(0.6);
    knight.setInteractive();

    const knightAnimKey = "knight-idle";
    const fireBreatherAnimKey = "fire-breather";

    const knightAnim = this.getNpcAnimation(knightAnimKey, "knight", 6);
    const fireBreatherAnim = this.getNpcAnimation(
      fireBreatherAnimKey,
      "fireBreather"
    );

    this.anims.create(knightAnim);
    this.anims.create(fireBreatherAnim);

    fireBreather.play(fireBreatherAnimKey);
    knight.play(knightAnimKey);

    this.physics.add.overlap(this.player, fireBreather, () => {
      this.player.anims.stop();

      if (!this.hasInteracted.has(fireBreatherAnimKey)) {
        this.interactionCount++;
        this.showModal("Ricordi? C'era pure lo Sputa Fuoco 🔥");
        this.hasInteracted.add(fireBreatherAnimKey);
        this.removeInteraction(fireBreatherAnimKey);
      }
    });

    this.physics.add.overlap(this.player, knight, () => {
      this.player.anims.stop();
      if (!this.hasInteracted.has(knightAnimKey)) {
        this.interactionCount++;
        this.showModal("Guarda che bravi!\n Prossimo anno dovremmo tornare...");
        this.hasInteracted.add(knightAnimKey);
        this.removeInteraction(knightAnimKey);
      }
    });
  }

  private loadGrateObject() {
    const { x, y } = this.getMapPosition(180, 300);
    const onGrateCollision = () => {
      if (!this.hasInteracted.has("grate")) {
        this.interactionCount++;
        this.hasInteracted.add("grate");
        this.showModal("Hai risolto il tuo piccolo problema con le grate? 👻");
        this.removeInteraction("grate");
      }
    };

    this.loadObject(x, y, "grate", 0.05, onGrateCollision);
  }

  create() {
    const { width, height } = this.scale;
    const mapSettings = this.cache.json.get(
      "medievalFestCollision"
    ) as MapSettings;
    const playerCoordinates = { x: width / 2, y: height / 2 + 124 };
    this.buildBackgroundWithColliders(mapSettings, playerCoordinates);
    this.loadNpcs();
    this.loadGrateObject();
    this.triggerTitle();

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
    }
  }
}
