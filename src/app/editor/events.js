import EventEmitter from "events";

const emitter = new EventEmitter();

export function onEditorScroll(fn) {
  emitter.addListener("scroll", fn);
}

export function offEditorScroll(fn) {
  emitter.removeListener("scroll", fn);
}

export function scrollEditor(value) {
  emitter.emit("scroll", value);
}
