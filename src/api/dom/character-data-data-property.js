import { definePrototypeAccessor } from "../../webidl/descriptor.js";
import { CharacterData } from "./character-data-constructor.js";
import { data } from "./character-data-data-getter.js";
import { setDataCallback } from "./character-data-data-setter.js";

export function installCharacterDataData() {
  definePrototypeAccessor(
    CharacterData.prototype,
    "data",
    data,
    setDataCallback,
  );
}
