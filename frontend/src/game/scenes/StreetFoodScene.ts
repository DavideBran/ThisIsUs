import { BusEvents, eventBus } from "../../utils/EventBus";
import type { MapSettings } from "./common/BaseScene";
import SceneWithInteractionModal from "./common/SceneWithInteractionModal";

export default class StreetFoodScene extends SceneWithInteractionModal {
  private titleClosed = false;
  private objectCount = 0;

  constructor() {
    super("StreetFoodScene");
  }

  private shouldShowPortal() {
    if (this.objectCount === 2) {
      const { x, y } = this.getMapPosition(260, 80);
      // #TODO this should load the next shene
      this.loadDoor("BrucoliScene", x, y);
    }
  }

  private triggerTitle() {
    eventBus.emit(BusEvents.SHOW_TITLE, "Street Food");
    eventBus.on(BusEvents.TITLE_ANIMATION_END, () => (this.titleClosed = true));
  }

  private loadObjects() {
    const { x: pizzaX, y: pizzaY } = this.getMapPosition(350, 150);
    const { x: suppliX, y: suppliY } = this.getMapPosition(160, 500);

    const onPizzaCollide = (
      obj: Phaser.Types.Physics.Arcade.ImageWithDynamicBody
    ) => {
      this.showModal(
        "Non lascio mai una fetta di pizzolo a NESSUNO 🍕 \n\n Ma tu? \n\n Tu eri diversa..."
      );

      obj.destroy();
      this.objectCount++;
      this.shouldShowPortal();
    };

    const onSuppliCoolide = (
      obj: Phaser.Types.Physics.Arcade.ImageWithDynamicBody
    ) => {
      this.showModal(
        `Ho scoperto solo più avanti quanto odiavi i Supplì. 
         \n Eppure pur di non dirmi No ti se "sacrificata" 💘`
      );

      obj.destroy();
      this.objectCount++;
      this.shouldShowPortal();
    };

    this.loadObject(pizzaX, pizzaY, "pizza", 0.1, onPizzaCollide);
    this.loadObject(suppliX, suppliY, "suppli", 0.1, onSuppliCoolide);
  }

  create() {
    const { width, height } = this.scale;
    const mapSettings = this.cache.json.get(
      "streetFoodCollision"
    ) as MapSettings;
    const playerCoordinates = { x: width / 2, y: height };
    this.buildBackgroundWithColliders(mapSettings, playerCoordinates);
    this.loadObjects();
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
