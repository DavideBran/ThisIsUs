import EventEmitter from "eventemitter3";

export enum BusEvents {
  SHOW_TITLE = "showTitle",
  TITLE_ANIMATION_END = "titleAnimationEnd"
}

export const eventBus = new EventEmitter();
