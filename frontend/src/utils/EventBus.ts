import EventEmitter from "eventemitter3";

export enum BusEvents {
  SHOW_TITLE = "showTitle",
  TITLE_ANIMATION_END = "titleAnimationEnd",
  SHOW_FINAL = 'final'
}

export const eventBus = new EventEmitter();
