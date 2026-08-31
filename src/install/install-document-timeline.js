import { DocumentTimeline, installDocumentTimelineConstructor } from "../api/animation/document-timeline-constructor.js";
import { defineConstructorBacklink, defineToStringTag } from "../webidl/descriptor.js";

export function installDocumentTimeline() {
  installDocumentTimelineConstructor();
  defineConstructorBacklink(DocumentTimeline.prototype, DocumentTimeline);
  defineToStringTag(DocumentTimeline.prototype, "DocumentTimeline");
}
