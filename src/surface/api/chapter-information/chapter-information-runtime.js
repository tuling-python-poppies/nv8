import { registerNativeFunction } from "../../../engine/webidl/native-function.js";

const state = new WeakMap();

export function ChapterInformation() {
  throw new TypeError(
    "Failed to construct 'ChapterInformation': Illegal constructor",
  );
}
registerNativeFunction(ChapterInformation, "ChapterInformation");

export function createChapterInformation(init) {
  const value = Object.create(ChapterInformation.prototype);
  state.set(value, {
    title: `${init.title}`,
    startTime: Number(init.startTime),
    artwork: init.artwork.map(image => ({ ...image })),
  });
  return value;
}

export function chapterInformationProperty(value, name) {
  const record = state.get(value);
  if (
    record === undefined
    || !["title", "startTime", "artwork"].includes(name)
  ) {
    throw new TypeError("Illegal invocation");
  }
  return record[name];
}
