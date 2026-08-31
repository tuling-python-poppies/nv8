import { installCharacterDataAfter } from "../api/dom/character-data-after.js";
import {
  installCharacterDataAppendData,
} from "../api/dom/character-data-append-data.js";
import { installCharacterDataBefore } from "../api/dom/character-data-before.js";
import {
  finishCharacterDataConstructor,
  installCharacterDataConstructor,
} from "../api/dom/character-data-constructor.js";
import {
  installCharacterDataData,
} from "../api/dom/character-data-data-property.js";
import {
  installCharacterDataDeleteData,
} from "../api/dom/character-data-delete-data.js";
import {
  installCharacterDataInsertData,
} from "../api/dom/character-data-insert-data.js";
import {
  installCharacterDataLength,
} from "../api/dom/character-data-length-getter.js";
import {
  installCharacterDataNextElementSibling,
} from "../api/dom/character-data-next-element-sibling-getter.js";
import {
  installCharacterDataPreviousElementSibling,
} from "../api/dom/character-data-previous-element-sibling-getter.js";
import { installCharacterDataRemove } from "../api/dom/character-data-remove.js";
import {
  installCharacterDataReplaceData,
} from "../api/dom/character-data-replace-data.js";
import {
  installCharacterDataReplaceWith,
} from "../api/dom/character-data-replace-with.js";
import {
  installCharacterDataSubstringData,
} from "../api/dom/character-data-substring-data.js";

export function installCharacterData() {
  installCharacterDataConstructor();
  installCharacterDataData();
  installCharacterDataLength();
  installCharacterDataPreviousElementSibling();
  installCharacterDataNextElementSibling();
  installCharacterDataAfter();
  installCharacterDataAppendData();
  installCharacterDataBefore();
  installCharacterDataDeleteData();
  installCharacterDataInsertData();
  installCharacterDataRemove();
  installCharacterDataReplaceData();
  installCharacterDataReplaceWith();
  installCharacterDataSubstringData();
  finishCharacterDataConstructor();
}
