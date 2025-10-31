import { BusEvents, eventBus } from "../../utils/EventBus";
import type { MapSettings } from "./common/BaseScene";
import SceneWithInteractionModal from "./common/SceneWithInteractionModal";

export default class BedroomScene extends SceneWithInteractionModal {
  private titleClosed = false;
  private readonly hasInteracted = new Set();
  private interactionCount = 0;

  constructor() {
    super("BedroomScene");
  }

  private triggerTitle() {
    eventBus.emit(BusEvents.SHOW_TITLE, "Davide's Bedroom", "Catania");
    eventBus.on(BusEvents.TITLE_ANIMATION_END, () => (this.titleClosed = true));
  }

  private triggerDoor() {
    const { x, y } = this.getMapPosition(260, 680);
    this.loadDoor("FinalScene", x, y);
  }

  private loadPhoneObject() {
    const { x, y } = this.getMapPosition(120, 350);
    const onPhoneCollision = (
      phone: Phaser.Types.Physics.Arcade.ImageWithDynamicBody
    ) => {
      if (!this.hasInteracted.has("phone")) {
        this.interactionCount++;
        this.hasInteracted.add("phone");
        this.showModal(
          "Ricordi le interminabili chiamate? \n\n Non vedevo l'ora arrivasse quel momento della giornata ❤️‍🩹"
        );
        phone.destroy();

        if (this.interactionCount === 2) {
          this.triggerDoor();
        }
      }
    };

    this.loadObject(x, y, "phone", 0.05, onPhoneCollision);
  }

  private loadLaptopObject() {
    const { x, y } = this.getMapPosition(280, 100);
    const onLaptopCollision = (
      laptop: Phaser.Types.Physics.Arcade.ImageWithDynamicBody
    ) => {
      if (!this.hasInteracted.has("laptop")) {
        this.interactionCount++;
        this.hasInteracted.add("laptop");
        this.showModal(
          "Le ore passate a guardare lo schermo del computer, non riuscendo a studiare \n Solo perchè mi sei entrata in testa 🧠"
        );

        laptop.destroy();

        if (this.interactionCount === 2) {
          this.triggerDoor();
        }
      }
    };

    this.loadObject(x, y, "laptop", 0.15, onLaptopCollision);
  }

  create() {
    const { width, height } = this.scale;
    const mapSettings = this.cache.json.get("bedroomCollision") as MapSettings;
    const playerCoordinates = { x: width / 2, y: height / 2 + 124 };
    this.buildBackgroundWithColliders(mapSettings, playerCoordinates);
    this.loadPhoneObject();
    this.loadLaptopObject();
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
