import {
  finishCommentConstructor,
  installCommentConstructor,
} from "../api/dom/comment-constructor.js";

export function installComment() {
  installCommentConstructor();
  finishCommentConstructor();
}
