import EventEmitter from "events";

const emitter = new EventEmitter();

let listeners = [];

export function onEditorScroll(fn) {
  listeners.push(fn);
}

export function offEditorScroll(fn) {
  listeners = listeners.filter((item) => item != fn);
}

emitter.on("scroll", function (value) {
  for (let l of listeners) {
    l(value);
  }
});

export function scrollEditor(value) {
  emitter.emit("scroll", value);
}
