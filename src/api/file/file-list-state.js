import { FileList } from "./file-list-constructor.js";

const fileListState = new WeakMap();

export function createFileList(files = []) {
  const list = Object.create(FileList.prototype);
  fileListState.set(list, { files: [], indexedLength: 0 });
  replaceFileList(list, files);
  return list;
}

export function requireFileList(list) {
  const state = fileListState.get(list);
  if (state === undefined) {
    throw new TypeError("Illegal invocation");
  }
  return state;
}

export function replaceFileList(list, files) {
  const state = requireFileList(list);
  for (let index = 0; index < state.indexedLength; index += 1) {
    delete list[index];
  }
  state.files = [...files];
  for (let index = 0; index < state.files.length; index += 1) {
    Object.defineProperty(list, index, {
      value: state.files[index],
      writable: false,
      enumerable: true,
      configurable: true,
    });
  }
  state.indexedLength = state.files.length;
}
