import {
  finishHTMLAudioElementConstructor,
  installHTMLAudioElementConstructor,
} from "../api/media/html-audio-element-constructor.js";

export function installHTMLAudioElement() {
  installHTMLAudioElementConstructor();
  finishHTMLAudioElementConstructor();
}
