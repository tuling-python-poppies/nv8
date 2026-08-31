import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  defineToStringTag,
} from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { traceConstruct } from "../../trace/trace-function.js";
import { CharacterData } from "./character-data-constructor.js";
import { currentDocument } from "./document-state.js";
import { COMMENT_NODE, initializeNode } from "./node-state.js";

export function Comment() {
  if (new.target === undefined) {
    throw new TypeError("Failed to construct 'Comment': Please use the 'new' operator, this DOM object constructor cannot be called as a function.");
  }
  const data = arguments.length === 0 ? "" : `${arguments[0]}`;
  initializeNode(this, COMMENT_NODE, "#comment", data, currentDocument());
  traceConstruct("window.Comment", [data], "Comment");
}
registerNativeFunction(Comment, "Comment");

export function createComment(data, ownerDocument) {
  const comment = Object.create(Comment.prototype);
  initializeNode(comment, COMMENT_NODE, "#comment", `${data}`, ownerDocument);
  return comment;
}

export function installCommentConstructor() {
  Object.setPrototypeOf(Comment.prototype, CharacterData.prototype);
  Object.setPrototypeOf(Comment, CharacterData);
  delete Comment.prototype.constructor;
  defineGlobalConstructor("Comment", Comment);
}

export function finishCommentConstructor() {
  defineConstructorBacklink(Comment.prototype, Comment);
  defineToStringTag(Comment.prototype, "Comment");
}
