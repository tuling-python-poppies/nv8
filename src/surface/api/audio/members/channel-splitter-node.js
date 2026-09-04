import * as runtime from "../audio-runtime.js";
import { ChannelSplitterNode } from "../audio-runtime.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(ChannelSplitterNode);
}

export function installRelation() {
  installDispatchedRelation(
    ChannelSplitterNode,
    "AudioNode",
    null,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(ChannelSplitterNode);
}

export function installTag() {
  installDispatchedTag(ChannelSplitterNode);
}
