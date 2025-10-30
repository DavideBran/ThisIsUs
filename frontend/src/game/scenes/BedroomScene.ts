import { BusEvents, eventBus } from "../../utils/EventBus";
import type { MapSettings } from "./common/BaseScene";
import SceneWithInteractionModal from "./common/SceneWithInteractionModal";

const CLEAR_TIMEOUT = 1000 * 10;
export default class BedroomScene extends SceneWithInteractionModal {
  private titleClosed = false;
  private readonly hasInteracted = new Set();
  private interactionCount = 0;

  constructor() {
    super("BedroomScene");
  }

  private shouldShowDoor() {
    if (this.interactionCount >= 3) {
      const { x, y } = this.getMapPosition(530, 420);
      this.loadDoor("BrucoliScene", x, y);
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
    eventBus.emit(BusEvents.SHOW_TITLE, "Davide's Bedroom", "Catania");
    eventBus.on(BusEvents.TITLE_ANIMATION_END, () => (this.titleClosed = true));
  }

  private loadPhoneObject() {
    const { x, y } = this.getMapPosition(180, 300);
    const onPhoneCollision = () => {
      if (!this.hasInteracted.has("phone")) {
        this.interactionCount++;
        this.hasInteracted.add("phone");
        this.showModal("Ricordi le interminabili chiamate? \n Non vedovo l'ora arrivasse quel momento della giornata...");
        this.removeInteraction("phone");
      }
    };

    this.loadObject(x, y, "phone", 0.05, onPhoneCollision);
  }

  create() {
    const { width, height } = this.scale;
    const mapSettings = this.cache.json.get(
      "bedroomCollision"
    ) as MapSettings;
    const playerCoordinates = { x: width / 2, y: height / 2 + 124 };
    this.buildBackgroundWithColliders(mapSettings, playerCoordinates);
    this.loadPhoneObject();
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
