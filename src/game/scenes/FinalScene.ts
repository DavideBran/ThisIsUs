import { BusEvents, eventBus } from "../../utils/EventBus";
import SceneWithInteractionModal from "./common/SceneWithInteractionModal";

export default class FinalScene extends SceneWithInteractionModal {
  constructor() {
    super("FinalScene");
  }

  create() {
    eventBus.emit(BusEvents.SHOW_FINAL);
  }
}
