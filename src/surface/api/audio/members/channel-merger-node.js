import * as runtime from "../audio-runtime.js";
import { ChannelMergerNode } from "../audio-runtime.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(ChannelMergerNode);
}

export function installRelation() {
  installDispatchedRelation(
    ChannelMergerNode,
    "AudioNode",
    null,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(ChannelMergerNode);
}

export function installTag() {
  installDispatchedTag(ChannelMergerNode);
}
