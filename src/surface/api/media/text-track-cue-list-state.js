import { TextTrackCueList } from "./text-track-cue-list-constructor.js";

const cueListState = new WeakMap();

export function createTextTrackCueList() {
  const list = Object.create(TextTrackCueList.prototype);
  cueListState.set(list, { items: [], indexedLength: 0 });
  return list;
}

export function requireTextTrackCueList(list) {
  const state = cueListState.get(list);
  if (state === undefined) throw new TypeError("Illegal invocation");
  return state;
}

function refreshTextTrackCueList(list) {
  const state = requireTextTrackCueList(list);
  for (let index = state.items.length; index < state.indexedLength; index += 1) {
    delete list[index];
  }
  for (let index = 0; index < state.items.length; index += 1) {
    Object.defineProperty(list, index, {
      value: state.items[index],
      writable: false,
      enumerable: true,
      configurable: true,
    });
  }
  state.indexedLength = state.items.length;
  return state.items;
}

export function appendTextTrackCue(list, cue) {
  const state = requireTextTrackCueList(list);
  if (state.items.includes(cue)) return false;
  state.items.push(cue);
  refreshTextTrackCueList(list);
  return true;
}

export function removeTextTrackCue(list, cue) {
  const state = requireTextTrackCueList(list);
  const index = state.items.indexOf(cue);
  if (index < 0) return false;
  state.items.splice(index, 1);
  refreshTextTrackCueList(list);
  return true;
}
